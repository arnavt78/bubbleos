const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const yauzl = require("yauzl");
const ProgressBar = require("progress");
const chalk = require("chalk");

const Verbose = require("../../classes/Verbose");
const Errors = require("../../classes/Errors");
const InfoMessages = require("../../classes/InfoMessages");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");
const Checks = require("../../classes/Checks");
const _nonFatalError = require("../../functions/nonFatalError");

/**
 * Promisified yauzl.open
 */
const openZip = (zipPath) =>
  new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) reject(err);
      else resolve(zipfile);
    });
  });

/**
 * Promisified openReadStream
 */
const openEntryStream = (zipfile, entry) =>
  new Promise((resolve, reject) => {
    zipfile.openReadStream(entry, (err, stream) => {
      if (err) reject(err);
      else resolve(stream);
    });
  });

/**
 * Extracts a ZIP archive to a destination folder.
 *
 * @param {string} zipPath Path to the zip file.
 * @param {string} destFolder Destination folder to extract into.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const extract = async (zipPath, destFolder, ...args) => {
  try {
    // Replace spaces and then convert the path to an absolute one to both the source and destination paths
    Verbose.parseQuotes();
    Verbose.pathAbsolute(zipPath);
    Verbose.pathAbsolute(destFolder);

    // Don't use PathUtil.all() because it doesn't work well with double paths
    [zipPath, destFolder] = PathUtil.parseQuotes([zipPath, destFolder, ...args])
      .map(PathUtil.homeDir)
      .map(PathUtil.convertAbsolute)
      .map(PathUtil.caseSensitive);

    Verbose.initChecker();
    const zipChk = new Checks(zipPath);
    const destChk = new Checks(destFolder);

    if (zipChk.paramUndefined() || destChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("the zip/destination", "extract file.zip dest");
      return;
    }

    if (!zipChk.doesExist()) {
      Verbose.chkExists(zipPath);
      Errors.doesNotExist("ZIP file", zipPath);
      return;
    }

    const showZip = new SettingManager().fullOrBase(zipPath);
    const showDest = new SettingManager().fullOrBase(destFolder);

    const zipfile = await openZip(zipPath);

    let totalBytes = 0;
    const entries = [];

    await new Promise((resolve) => {
      zipfile.on("entry", (entry) => {
        entries.push(entry);
        totalBytes += entry.uncompressedSize || 0;
        zipfile.readEntry();
      });

      zipfile.on("end", resolve);
      zipfile.readEntry();
    });

    // Reopen ZIP because first pass is consumed
    zipfile.close();
    const zipfile2 = await openZip(zipPath);
    let processedBytes = 0;

    let bar = null;
    if (totalBytes > 0) {
      bar = new ProgressBar(
        `${chalk.cyan("Extracting")} [:bar] ${chalk.green(":percent")} ${chalk.magenta(":etas")}`,
        {
          total: totalBytes,
          width: 30,
          incomplete: " ",
          complete: chalk.green("="),
        }
      );
    }

    return new Promise((resolve, reject) => {
      zipfile2.readEntry();

      zipfile2.on("entry", async (entry) => {
        const fullPath = path.join(destFolder, entry.fileName);

        try {
          if (/\/$/.test(entry.fileName)) {
            await fsp.mkdir(fullPath, { recursive: true });
            zipfile2.readEntry();
          } else {
            await fsp.mkdir(path.dirname(fullPath), { recursive: true });

            const readStream = await openEntryStream(zipfile2, entry);
            const writeStream = fs.createWriteStream(fullPath);

            readStream.on("data", (chunk) => {
              processedBytes += chunk.length;
              bar?.tick(chunk.length);
            });

            await new Promise((res, rej) => {
              readStream.pipe(writeStream);
              readStream.on("end", res);
              readStream.on("error", rej);
            });

            zipfile2.readEntry();
          }
        } catch (err) {
          reject(err);
        }
      });

      zipfile2.on("end", () => {
        InfoMessages.success(
          `Successfully extracted ${chalk.bold(showZip)} to ${chalk.bold(showDest)}.`
        );
        resolve();
      });

      zipfile2.on("error", reject);
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = extract;
