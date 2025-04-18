const chalk = require("chalk");
const fs = require("fs");

const _convertSize = require("../../functions/convertSize");
const _nonFatalError = require("../../functions/nonFatalError");
const _getSize = require("../../functions/getSize");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const Verbose = require("../../classes/Verbose");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

const _getDate = (date) => {
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", dateOptions).format(date);
};

/**
 * Show information of a file or directory from the BubbleOS CLI.
 *
 * Includes:
 * - Location
 * - Size
 * - Created
 * - Modified
 * - Accessed
 *
 * @param {string} path The file/directory to get information on.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const stat = async (path = process.cwd(), ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute(path);
    Verbose.parseQuotes();
    path = PathUtil.all([path, ...args]);

    Verbose.initChecker();
    const pathChk = new Checks(path);

    Verbose.initShowPath();
    const showPath = new SettingManager().fullOrBase(path);

    if (pathChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file/directory", "stat test.txt");
      return;
    } else if (!pathChk.doesExist()) {
      Verbose.chkExists();
      Errors.doesNotExist("file/directory", showPath);
      return;
    } else if (pathChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    Verbose.custom("Outputting location of path...");
    console.log(`Location: ${chalk.bold(path)}`);

    Verbose.custom("Calculating size...");
    const size = _convertSize(
      await _getSize(path, pathChk.validateType() ? "directory" : "file"),
      2
    );

    const sizeColor = size.size === 0 ? chalk.yellow : chalk.green;
    console.log("Size: " + chalk.bold(sizeColor(`${size.size} ${size.unit}\n`)));

    Verbose.custom("Obtaining and calculating created, modified and accessed date of path...");
    const stats = fs.statSync(path);

    console.log("Created: " + chalk.bold(`${_getDate(stats.birthtime)}`));
    console.log("Modified: " + chalk.bold(`${_getDate(stats.mtime)}`));
    console.log("Accessed: " + chalk.bold(`${_getDate(stats.atime)}`));

    console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showPath = new SettingManager().fullOrBase(path);

    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("get additional information of the file/directory", showPath);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file/directory", showPath);
    } else if (err.code === "ENOENT") {
      // For some reason, there are rare cases where the checks think the path exists,
      // but when trying to check stats, it throws an error.
      // This usually happens when using the BubbleOS executable, where a directory called
      // "C:\snapshot" is visible on Windows (through 'ls' in BubbleOS), but when trying to
      // get stats, it throws an error.

      Verbose.custom("Path does not exist.");
      Errors.doesNotExist("file/directory", showPath);
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

module.exports = stat;
