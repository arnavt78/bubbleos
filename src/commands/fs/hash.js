const chalk = require("chalk");
const fs = require("fs");
const crypto = require("crypto");
const { input } = require("@inquirer/prompts");

const _nonFatalError = require("../../functions/nonFatalError");
const _exit = require("../../functions/exit");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const Verbose = require("../../classes/Verbose");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

/**
 * All of the available hashes in the `crypto` module.
 */
const HASHES = [
  "md5",
  "sha1",
  "sha224",
  "sha256",
  "sha384",
  "sha512",
  "sha3-224",
  "sha3-256",
  "sha3-384",
  "sha3-512",
  "shake128",
  "shake256",
];

/**
 * Logs the hash requested in a `console.log`.
 *
 * @param {string} hashAlgo The hash algorithm, one in `HASHES`.
 * @param {string} contents The contents of the file.
 */
const _logHash = (hashAlgo, contents) => {
  console.log(
    `${chalk.green(hashAlgo.toUpperCase() + ":")} ${crypto
      .createHash(hashAlgo.toLowerCase())
      .update(contents)
      .digest("hex")}`
  );
};

/**
 * List hashes of a file. Available hashes are in the
 * `HASHES` array.
 *
 * There are no arguments for this command, other than the required file.
 *
 * @param {string} file The file to check the hash for.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const hash = async (file, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute(file);
    Verbose.parseQuotes();
    file = PathUtil.all([file, ...args]);

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "hash test.txt");
      return;
    }

    if (!fileChk.doesExist()) {
      Verbose.chkExists(file);
      Errors.doesNotExist("file", showFile);
      return;
    } else if (fileChk.validateType()) {
      Verbose.chkType(file, "file");
      Errors.expectedFile(showFile);
      return;
    } else if (fileChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    // Ask user for hashes
    // If not hashes are provided, the default is to show all hashes
    Verbose.custom("Requesting user for hashes...");
    const requested = (
      await input({
        message: `Enter the file hashes to be shown (separate values with a space, or enter nothing for all values):`,
        theme: {
          style: {
            answer: (text) => chalk.reset(text),
          },
        },
      })
    ).split(" ");

    Verbose.custom("Reading file...");
    const contents = fs.readFileSync(file, { encoding: "utf-8", flag: "r" });

    // If user entered nothing, show all hashes
    const all = requested[0] === "";

    console.log();

    if (all) {
      Verbose.custom("Showing all hashes...");
      HASHES.forEach((hashAlgo) => {
        Verbose.custom(`Showing '${hashAlgo.toUpperCase()}' hash...`);
        _logHash(hashAlgo, contents);
      });
    } else {
      Verbose.custom("Showing specified hashes...");
      requested.forEach((hashAlgo) => {
        Verbose.custom(`Showing '${hashAlgo.toUpperCase()}' hash...`);
        if (!HASHES.includes(hashAlgo))
          console.log(chalk.yellow(`Unrecognized hash: ${chalk.italic(hashAlgo)}`));
        else _logHash(hashAlgo, contents);
      });
    }

    console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (err.name === "ExitPromptError") {
      // If the user presses Ctrl+C, exit BubbleOS gracefully
      Verbose.custom("Detected Ctrl+C, exiting...");
      _exit();
    } else if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("read the file", showFile);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file", showFile);
    } else if (err.code === "ENXIO") {
      Verbose.noDeviceError();
      Errors.noDevice(showFile);
    } else if (err.code === "EINVAL") {
      Verbose.invalOperationError();
      Errors.invalidOperation();
    } else if (err.code === "UNKNOWN") {
      Verbose.unknownError();
      Errors.unknown();
    } else {
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = hash;
