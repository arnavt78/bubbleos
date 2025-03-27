const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const { GLOBAL_NAME } = require("../../variables/constants");

const _promptForYN = require("../../functions/promptForYN");
const _nonFatalError = require("../../functions/nonFatalError");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const InfoMessages = require("../../classes/InfoMessages");
const Verbose = require("../../classes/Verbose");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

/**
 * The maximum amount of characters before BubbleOS
 * asks the user to make sure that they want to read
 * the number of characters.
 */
const MAX_CHARS_CONFIRM = 5000;
/**
 * The maximum amount of characters that BubbleOS
 * can read.
 */
const MAX_CHARS_READ = 100_000;

/**
 * Read a file in BubbleOS.
 *
 * BubbleOS has a limit on the number of characters
 * it can read (defined in `MAX_CHARS_READ`) and a
 * maximum number of characters before it confirms
 * that the user would like to read that many
 * characters (defined in `MAX_CHARS_CONFIRM`).
 * However, both can be bypassed using the `-y`
 * and `--ignore-max` flags for `MAX_CHARS_CONFIRM`
 * and `MAX_CHARS_READ`, respectively.
 *
 * Available arguments:
 * - `-y`: Bypass the confirmation of `MAX_CHARS_CONFIRM`.
 * - `--ignore-max`: Bypass the error of
 * `MAX_CHARS_READ`.
 *
 * @param {string} file The file that should be read. Both absolute and relative paths are accepted.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const readfile = (file, ...args) => {
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

    Verbose.initArgs();
    const confirm = !args.includes("-y");
    const ignoreMax = args.includes("--ignore-max");

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "readfile test.txt");
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
    } else if (!fileChk.validEncoding()) {
      Verbose.chkEncoding();
      Errors.invalidEncoding("plain text");
      return;
    }

    // Get contents and number of characters
    Verbose.custom(`Reading file: ${file}...`);
    const contents = fs.readFileSync(file, { encoding: "utf-8", flag: "r" });
    const chars = contents.length;

    // If the number of characters is greater than/equal to the maximum characters
    // that BubbleOS can read, and the user did not use the '--ignore-max' flag
    if (chars >= MAX_CHARS_READ && !ignoreMax) {
      Verbose.custom("Detected too many characters to read.");
      InfoMessages.error(
        `Too many characters to read (${chars} characters). ${GLOBAL_NAME} only supports reading less than ${MAX_CHARS_READ} characters.`
      );
      return;
    } else if (chars >= MAX_CHARS_CONFIRM && confirm) {
      // If the characters is greater than/equal to the number of characters before BubbleOS
      // must confirm that the user wishes to read this many lines, unless they've already pre-accepted
      Verbose.promptUser();
      if (
        !_promptForYN(
          `The file, ${path.basename(
            file
          )}, has over ${MAX_CHARS_CONFIRM} characters (${chars} characters). Do you wish to continue?`
        )
      ) {
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }

      console.log();
    }

    // Log the file
    console.log(contents + "\n");
  } catch (err) {
    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (err.code === "EPERM" || err.code === "EACCES") {
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

module.exports = readfile;
