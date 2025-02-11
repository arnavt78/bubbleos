const chalk = require("chalk");

const fs = require("fs");
const childProcess = require("child_process");

const _parseDoubleQuotes = require("../functions/parseQuotes");
const _convertAbsolute = require("../functions/convAbs");
const _fatalError = require("../functions/fatalError");
const _caseSensitivePath = require("../functions/caseSensitivePath");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

/**
 * Execute a file from BubbleOS. This is meant to be used as a
 * CLI tool for the BubbleOS shell.
 *
 * Please note that even though any extension is accepted, and
 * that BubbleOS will not validate extensions, there are chances
 * when a file cannot run, even when the success message is shown.
 *
 * Available arguments:
 * - `-s`: Silently execute a file. This will silence all outputs
 * to the standard output, except for error messages.
 * - `-h`: Hide the subprocess console window that would normally
 * be created on Windows systems.
 * - `--sh`: If this argument is passed, the executable will run
 * inside of a shell.
 *
 * @param {string} file The filename to execute. Both absolute and relative paths are accepted.
 * @param {...string} args The arguments to change the behavior of `exec`. Available arguments are listed above.
 * @returns
 */
const exec = (file, ...args) => {
  try {
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    file = _caseSensitivePath(_convertAbsolute(_parseDoubleQuotes([file, ...args])[0]));

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initArgs();
    const silent = args?.includes("-s");
    const winHide = args?.includes("-h");
    const shell = args?.includes("--sh");

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "exec test");
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
      Errors.invalidUNCPath();
      return;
    }

    // Execute the file
    // Not using execSync() as that does not let BubbleOS continue
    // unless the window is closed. This should be used instead, with an
    // empty callback function.
    Verbose.custom(`Executing the file '${file}'...`);
    childProcess.exec(file, { cwd: process.cwd(), windowsHide: winHide, shell }, () => {});

    if (!silent) InfoMessages.success(`Successfully executed ${chalk.bold(file)}.`);
    else console.log();
  } catch (err) {
    if (err.code === "UNKNOWN") {
      // This for some reason, never occurs
      // TODO make it so that if a file has no way of running, make it show this error
      Verbose.custom("Cannot execute file due to no known way of launching.");
      Errors.unknown("execute the file", file);
    } else if (err.code === "EPERM") {
      Verbose.permError();
      Errors.noPermissions("run the file", file);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file", file);
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = exec;
