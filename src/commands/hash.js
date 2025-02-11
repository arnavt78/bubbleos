const chalk = require("chalk");
const fs = require("fs");
const crypto = require("crypto");
const { question } = require("readline-sync");

const _parseDoubleQuotes = require("../functions/parseQuotes");
const _convertAbsolute = require("../functions/convAbs");
const _fatalError = require("../functions/fatalError");
const _caseSensitivePath = require("../functions/caseSensitivePath");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");

/**
 * All of the available hashes in the `crypto` module.
 */
const AVAILABLE_HASHES = [
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
 * @param {string} hashAlgo The hash algorithm, one in `AVAILABLE_HASHES`.
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
 * `AVAILABLE_HASHES` array.
 *
 * There are no arguments for this command, other than the required file.
 *
 * @param {string} file The file to check the hash for.
 * @param {...string} args All recognized arguments. All available arguments are listed above.
 */
const hash = (file, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute(file);
    Verbose.parseQuotes();
    file = _caseSensitivePath(_convertAbsolute(_parseDoubleQuotes([file, ...args])[0]));

    Verbose.initChecker();
    const fileChk = new Checks(file);

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "hash test.txt");
      return;
    }

    if (!fileChk.doesExist()) {
      Verbose.chkExists(file);
      Errors.doesNotExist("file", file);
      return;
    } else if (fileChk.validateType()) {
      Verbose.chkType(file, "file");
      Errors.expectedFile(file);
      return;
    } else if (fileChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    // Ask user for hashes
    // If not hashes are provided, the default is to show all hashes
    Verbose.custom("Prompting user for hashes...");
    const requested = question(
      `Enter the file hashes to be shown (${chalk.italic("'Enter'")} to accept; ${chalk.italic(
        "'all'"
      )} for all hashes; insert space to add multiple): `
    ).split(" ");

    Verbose.custom("Reading file...");
    const contents = fs.readFileSync(file, { encoding: "utf-8", flag: "r" });

    // If user specifically requested all hashes, or entered nothing
    const all =
      (requested.length === 1 && requested[0].toLowerCase() === "all") || requested[0] === "";

    console.log();

    if (all) {
      Verbose.custom("Showing all hashes...");
      AVAILABLE_HASHES.forEach((hashAlgo) => {
        Verbose.custom(`Showing '${hashAlgo.toUpperCase()}' hash...`);
        _logHash(hashAlgo, contents);
      });
    } else {
      Verbose.custom("Showing specified hashes...");
      requested.forEach((hashAlgo) => {
        Verbose.custom(`Showing '${hashAlgo.toUpperCase()}' hash...`);
        if (!AVAILABLE_HASHES.includes(hashAlgo))
          console.log(chalk.yellow(`Unrecognized hash: ${chalk.italic(hashAlgo)}`));
        else _logHash(hashAlgo, contents);
      });
    }

    console.log();
  } catch (err) {
    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("read the file", file);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file", file);
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = hash;
