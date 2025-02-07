const chalk = require("chalk");
const fs = require("fs");

const _parseDoubleQuotes = require("../functions/parseQuotes");
const _convertAbsolute = require("../functions/convAbs");
const _caseSensitivePath = require("../functions/caseSensitivePath");
const _convertSize = require("../functions/convSize");
const _fatalError = require("../functions/fatalError");
const _getSize = require("../functions/getSize");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");

/**
 * A function to calculate and return the sizes of a file or directory.
 *
 * @param {string} path The path of the file or directory.
 * @param {object} pathChk The Checks instance for the path.
 * @returns {object} The sizes of the file or directory in different units.
 */
const _calcSize = (path, pathChk) => {
  Verbose.custom("Calculating size...");
  const totalSize = _getSize(path, pathChk.validateType() ? "directory" : "file");

  // The size shortened to 2 decimal places
  Verbose.custom("Converting size and shortening...");
  const allSizes = _convertSize(totalSize, 2);

  // Priority order of size units
  const sizeLabels = ["GB", "MB", "KB", "bytes"];
  const sizeValues = [allSizes.gigabytes, allSizes.megabytes, allSizes.kilobytes, allSizes.bytes];

  Verbose.custom("Finding best unit of measurement to use...");
  for (let i = 0; i < sizeValues.length; i++) {
    if (sizeValues[i] > 0) {
      // Adjust "bytes" to singular if the size is 1
      const label = sizeLabels[i] === "bytes" && sizeValues[i] === 1 ? "byte" : sizeLabels[i];
      return { [label]: sizeValues[i] };
    }
  }

  return { bytes: 0 };
};

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
 * @param {...string} args The arguments to change the behavior of `stat`.
 */
const stat = (path, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    path = _caseSensitivePath(_convertAbsolute(_parseDoubleQuotes([path, ...args])[0]));

    Verbose.initChecker();
    const pathChk = new Checks(path);

    if (pathChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file/directory", "stat test.txt");
      return;
    } else if (!pathChk.doesExist()) {
      Verbose.chkExists();
      Errors.doesNotExist("file/directory", path);
      return;
    } else if (pathChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    console.log(`Location: ${chalk.bold(path)}`);

    const size = _calcSize(path, pathChk);
    const sizeLabel = Object.keys(size)[0];

    const sizeValue = size[sizeLabel];
    const sizeColor = sizeValue === 0 ? chalk.yellow : chalk.green;
    console.log("Size: " + chalk.bold(sizeColor(`${sizeValue} ${sizeLabel}\n`)));

    const stats = fs.statSync(path);

    console.log("Created: " + chalk.bold(`${_getDate(stats.birthtime)}`));
    console.log("Modified: " + chalk.bold(`${_getDate(stats.mtime)}`));
    console.log("Accessed: " + chalk.bold(`${_getDate(stats.atime)}`));

    console.log();
  } catch (err) {
    if (err.code === "EPERM") {
      Verbose.permError();
      Errors.noPermissions("get additional information of the file/directory", path);
      return;
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file/directory", path);
      return;
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = stat;
