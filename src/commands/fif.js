// Color the terminal and check to make sure that the file is plain text
const chalk = require("chalk");
const { isText } = require("istextorbinary");

// Node.js built-in file system module
const fs = require("fs");
const path = require("path");

// Custom-made functions
const _errorInterpret = require("../functions/errorInt");

const _replaceSpaces = require("../functions/replaceSpaces");
const _convertAbsolute = require("../functions/convAbs");

const _fatalError = require("../functions/fatalError");

/**
 * Find a word or phrase in a file.
 *
 * Usage (code):
 * ```js
 * fif("test.txt", "hello");
 * ```
 *
 * Usage (terminal):
 * ```
 * $ fif text.txt world
 * ```
 *
 * @param {string} file A path to the file to search in. Please note directories are not valid.
 * @param {string} toFind The word or phrase to find
 */
const fif = (file, toFind) => {
  file = _replaceSpaces(file);

  // Check to make sure the file/phrase to find is not empty
  if (!file || !toFind) {
    _errorInterpret(2, { type: "the file and the phrase to find", example: "fif test.txt hello" });
    return;
  }

  // Convert the path to absolute
  const fileName = _convertAbsolute(file);

  // Make sure the file exists
  if (!fs.existsSync(fileName)) {
    _errorInterpret(3, { type: "file", variable: fileName });
    return;
  }

  try {
    if (fs.lstatSync(fileName).isDirectory()) {
      _errorInterpret(9, { command: "fif" });
      return;
    }

    // Make sure the file IS a text file
    if (!isText(fileName, fs.readFileSync(fileName, { flag: "r" }))) {
      _errorInterpret(8, { encoding: "UTF-8 (plain text files)" });
      return;
    }

    // Just to clean it up :)
    const contents = fs.readFileSync(fileName, { encoding: "utf-8", flag: "r" });

    // You gotta be careful with this
    // The brackets seem to confuse a few

    // Log the number of occurances
    console.log(
      `Number of occurances: ${chalk.bold.green(
        (contents.match(new RegExp(toFind, "ig")) || []).length
      )}\n`
    );

    // TODO Add highlighted appearance
    // The issue is that String.replaceAll doesn't seem to be helping
    // Even when paired with Chalk
    // For loops will not help
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = fif;
