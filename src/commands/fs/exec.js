const chalk = require("chalk");
const execa = require("execa");

const _nonFatalError = require("../../functions/nonFatalError");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const InfoMessages = require("../../classes/InfoMessages");
const Verbose = require("../../classes/Verbose");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

/**
 * Execute a file from BubbleOS.
 *
 * Please note that even though any extension is accepted, and
 * that BubbleOS will not validate extensions, there are chances
 * when a file cannot run, even when the success message is shown.
 *
 * @param {string} file The filename to execute. Both absolute and relative paths are accepted.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const exec = async (file, ...args) => {
  try {
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    file = PathUtil.all([file, ...args]);

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

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

    // Execute the file without blocking the main process
    Verbose.custom(`Executing the file '${file}'...`);
    const subprocess = execa(file, [], {
      cwd: process.cwd(),
      detached: true, // Allows independent execution
      stdio: "ignore", // Prevents waiting for output
    });

    subprocess.unref(); // Fully detach process from parent

    if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
      InfoMessages.success(`Successfully executed ${chalk.bold(showFile)}.`);
    else console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (err.code === "UNKNOWN") {
      Verbose.unknownError();
      Errors.unknown();
    } else if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("run the file", showFile);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file", showFile);
    } else if (err.code === "ENXIO") {
      Verbose.noDeviceError();
      Errors.noDevice(showFile);
    } else if (err.code === "EINVAL") {
      Verbose.invalOperationError();
      Errors.invalidOperation();
    } else {
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = exec;
