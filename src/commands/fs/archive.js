const fs = require("fs");
const archiver = require("archiver");
const ProgressBar = require("progress");
const chalk = require("chalk");

const _getSize = require("../../functions/getSize");
const _promptForYN = require("../../functions/promptForYN");
const _convertSize = require("../../functions/convertSize");
const _nonFatalError = require("../../functions/nonFatalError");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const Verbose = require("../../classes/Verbose");
const InfoMessages = require("../../classes/InfoMessages");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

/**
 * Compresses a directory into a zip file.
 *
 * @param {string} src The source directory to compress.
 * @param {string} outputFile The output file to write the compressed data to.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const archive = async (src, outputFile, ...args) => {
  try {
    // Replace spaces and then convert the path to an absolute one to both the source and destination paths
    Verbose.parseQuotes();
    Verbose.pathAbsolute(src);
    Verbose.pathAbsolute(outputFile);

    // Don't use PathUtil.all() because it doesn't work well with double paths
    [src, outputFile] = PathUtil.parseQuotes([src, outputFile, ...args])
      .map(PathUtil.homeDir)
      .map(PathUtil.convertAbsolute)
      .map(PathUtil.caseSensitive);

    Verbose.initChecker();
    const srcChk = new Checks(src);
    const outputFileChk = new Checks(outputFile);

    // Automatically convert output to end with .zip
    Verbose.custom("Converting file to .zip file...");
    outputFile = outputFile?.endsWith(".zip") ? outputFile : `${outputFile}.zip`;

    Verbose.initShowPath();
    const showSrc = new SettingManager().fullOrBase(src);
    const showOutputFile = new SettingManager().fullOrBase(outputFile);

    Verbose.initArgs();
    const confirmOverwrite = !args.includes("-y");

    if (srcChk.paramUndefined() || outputFileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("the source/output", "archive src output");
      return;
    }

    if (!srcChk.doesExist()) {
      Verbose.chkExists(src);
      Errors.doesNotExist("source", showSrc);
      return;
    } else if (!srcChk.validateType()) {
      Verbose.chkType(src, "directory");
      Errors.expectedDir(showSrc);
      return;
    } else if (srcChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    if (confirmOverwrite && outputFileChk.doesExist()) {
      Verbose.custom(
        `Output file '${outputFile}' exists, confirming if user wants to overwrite it...`
      );
      if (
        !_promptForYN(
          `The file, ${chalk.bold(
            showOutputFile
          )} exists and will be overwritten. Do you want to continue?`
        )
      ) {
        Verbose.declinePrompt();
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }

      console.log();
    }

    const output = fs.createWriteStream(outputFile);
    const archive = archiver("zip", { zlib: { level: 9 } });

    let bar = null;

    const totalBytes = await _getSize(src, "directory");
    const { size: totalSize, unit: sizeUnit } = _convertSize(totalBytes, 2);

    if (totalBytes > 0) {
      bar = new ProgressBar(
        `${chalk.cyan("Zipping")} [:bar] ${chalk.green(":percent")} ${chalk.magenta(":etas")}`,
        {
          total: 100,
          width: 30,
          incomplete: " ",
          complete: chalk.green("="),
        }
      );
    }

    return new Promise((resolve, reject) => {
      output.on("close", async () => {
        if (bar) {
          bar.update(1);
        }

        const zipSize = await _getSize(outputFile, "file");
        const { size: finalSize, unit: finalUnit } = _convertSize(zipSize, 2);

        console.log(
          `${chalk.bold("Compression size difference:")} ${chalk.red(
            totalSize + " " + sizeUnit
          )} -> ${chalk.green(finalSize + " " + finalUnit)}`
        );

        InfoMessages.success(
          `Successfully zipped ${chalk.bold(showSrc)} to ${chalk.bold(showOutputFile)}.`
        );
        resolve();
      });

      archive.on("error", (err) => reject(err));

      archive.on("progress", (data) => {
        if (bar) {
          const progress = (data.fs.processedBytes / totalBytes) * 100;
          bar.update(progress / 100);
        }
      });

      archive.pipe(output);
      archive.directory(src, false);
      archive.finalize();
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = archive;
