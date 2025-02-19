const chalk = require("chalk");
const childProcess = require("child_process");

const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");

/**
 * Execute a file from BubbleOS.
 *
 * Please note that even though any extension is accepted, and
 * that BubbleOS will not validate extensions, there are chances
 * when a file cannot run, even when the success message is shown.
 *
 * Available arguments:
 * - `-h`: Hide the subprocess console window that would normally
 * be created on Windows systems.
 * - `--sh`: If this argument is passed, the executable will run
 * inside of a shell.
 *
 * @param {string} file The filename to execute. Both absolute and relative paths are accepted.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const exec = (file, ...args) => {
  try {
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    file = PathUtil.all([file, ...args]);

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    Verbose.initArgs();
    const winHide = args?.includes("-h");
    const shell = args?.includes("--sh");

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "exec test");
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

    // Execute the file
    // Not using execSync() as that does not let BubbleOS continue
    // unless the window is closed. This should be used instead, with an
    // empty callback function.
    Verbose.custom(`Executing the file '${file}'...`);
    childProcess.exec(file, { cwd: process.cwd(), windowsHide: winHide, shell }, () => {});

    if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
      InfoMessages.success(`Successfully executed ${chalk.bold(showFile)}.`);
    else console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (err.code === "UNKNOWN") {
      // This for some reason, never occurs
      // TODO make it so that if a file has no way of running, make it show this error
      Verbose.custom("Cannot execute file due to no known way of launching.");
      Errors.unknown("execute the file", showFile);
    } else if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("run the file", showFile);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file", showFile);
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = exec;
