const chalk = require("chalk");
const fs = require("fs");

const _promptForYN = require("../functions/promptForYN");
const _nonFatalError = require("../functions/nonFatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const ConfigManager = require("../classes/ConfigManager");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");

/**
 * Delete a file/directory from BubbleOS.
 *
 * Available arguments:
 * - `-y`: Automatically accepts the confirmation prompt
 * before deleting a file.
 *
 * @param {string} path The relative or absolute path to the file/directory to delete.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const del = (path, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    path = PathUtil.all([path, ...args]);

    Verbose.initChecker();
    const pathChk = new Checks(path);

    Verbose.initShowPath();
    const showPath = new SettingManager().fullOrBase(path);

    Verbose.initArgs();
    const confirmDel = !args.includes("-y");

    if (pathChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file/directory", "del test");
      return;
    }

    if (!pathChk.doesExist()) {
      Verbose.chkExists();
      Errors.doesNotExist("file/directory", showPath);
      return;
    } else if (pathChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    } else if (new ConfigManager().isConfig(path)) {
      // Prevents the user from deleting the configuration file
      Verbose.initConfig();
      Verbose.inUseError();
      Errors.inUse("file", showPath);
      return;
    }

    // Confirms user wants to delete path
    if (confirmDel) {
      Verbose.promptUser();
      if (!_promptForYN(`Are you sure you want to permanently delete ${chalk.bold(showPath)}?`)) {
        Verbose.declinePrompt();
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }
    }

    // Deletes the file/directory
    Verbose.custom(`Deleting file/directory '${path}'...`);
    fs.rmSync(path, { recursive: true, force: true });

    if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
      InfoMessages.success(`Successfully deleted ${chalk.bold(showPath)}.`);
    else console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showPath = new SettingManager().fullOrBase(path);

    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("delete the file/directory", showPath);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file/directory", showPath);
    } else if (err.code === "ENXIO") {
      Verbose.noDeviceError();
      Errors.noDevice(showPath);
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

module.exports = del;
