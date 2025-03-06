const chalk = require("chalk");
const fs = require("fs");

const _nonFatalError = require("../functions/nonFatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");

/**
 * Creates a hard link on the system.
 *
 * @param {string} path The path to make the link point to.
 * @param {string} newPath The new path that points to the existing path.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const link = (path, newPath, ...args) => {
  try {
    Verbose.pathAbsolute(path);
    Verbose.parseQuotes();
    path = PathUtil.all([path, newPath, ...args]);

    Verbose.initChecker();
    const pathChk = new Checks(path);
    const newPathChk = new Checks(newPath);

    Verbose.initShowPath();
    const showPath = new SettingManager().fullOrBase(path);
    const showNewPath = new SettingManager().fullOrBase(newPath);

    if (pathChk.paramUndefined() || newPathChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a path/the paths", "link path newPath");
      return;
    }

    if (!pathChk.doesExist()) {
      Verbose.chkExists();
      Errors.doesNotExist("file/directory", showPath);
      return;
    } else if (pathChk.validateType()) {
      Verbose.chkType(showPath, "file");
      Errors.expectedFile(showPath);
      return;
    } else if (pathChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    // Links file
    Verbose.custom("Linking file...");
    fs.linkSync(path, newPath);

    if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
      InfoMessages.success(
        `Successfully linked ${chalk.bold(showNewPath)} to ${chalk.bold(showPath)}.`
      );
    else console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showNewPath = new SettingManager().fullOrBase(newPath);

    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("make the link", showNewPath);
    } else if (err.code === "ENXIO") {
      Verbose.noDeviceError();
      Errors.noDevice(showNewPath);
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

module.exports = link;
