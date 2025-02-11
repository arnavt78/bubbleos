const fs = require("fs");
const chalk = require("chalk");

const { GLOBAL_NAME } = require("../variables/constants");

const _parseDoubleQuotes = require("../functions/parseQuotes");
const _convertAbsolute = require("../functions/convAbs");
const _caseSensitivePath = require("../functions/caseSensitivePath");
const _promptForYN = require("../functions/promptForYN");
const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

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
 * Read a file in the BubbleOS CLI shell synchronously.
 * This has a character limit, that can be bypassed.
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
 * @param {...string} args The arguments to modify the behavior of `readfile`. Available arguments are above.
 */
const readfile = (file, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    file = _caseSensitivePath(_convertAbsolute(_parseDoubleQuotes([file, ...args])[0]));

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initArgs();
    const confirm = !args?.includes("-y");
    const ignoreMax = args?.includes("--ignore-max");

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "readfile test.txt");
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
    } else if (!fileChk.validEncoding()) {
      Verbose.chkEncoding();
      Errors.invalidEncoding("plain text");
      return;
    }

    // Get contents and number of characters
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
          `The file, ${chalk.bold(
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
    Verbose.custom("Reading file...");
    console.log(fs.readFileSync(file, { encoding: "utf-8", flag: "r" }));
    console.log();
  } catch (err) {
    if (err.code === "EPERM") {
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

module.exports = readfile;
