const chalk = require("chalk");
const fs = require("fs");

const _parseDoubleQuotes = require("../functions/parseQuotes");
const _convertAbsolute = require("../functions/convAbs");
const _caseSensitivePath = require("../functions/caseSensitivePath");
const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");

/**
 * Count the number of words, lines, and characters
 * in a file.
 *
 * Count the number of lines, words, characters with
 * whitespace and the opposite. In the scenario that
 * the characters with whitespace and the characters
 * without are the same, it will only show it as one
 * value.
 *
 * Available arguments:
 * - `-l`: Only shows the number of lines in a file.
 * - `-w`: Only shows the number of words in a file.
 * - `-c`: Only shows the number of characters in a file.
 *
 * @param {string} file The file to count the words in.
 * @param {...string} args Arguments to modify the behavior of `wcount`.
 */
const wcount = (file, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute(file);
    Verbose.parseQuotes();
    file = _caseSensitivePath(_convertAbsolute(_parseDoubleQuotes([file, ...args])[0]));

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initArgs();
    const lines = args?.includes("-l");
    const words = args?.includes("-w");
    const chars = args?.includes("-c");

    const all = !lines && !words && !chars;

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "wcount text.txt");
      return;
    } else if (!fileChk.doesExist()) {
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

    Verbose.custom("Reading contents of file provided...");
    const contents = fs.readFileSync(file, { encoding: "utf-8", flag: "r" });

    Verbose.custom("Counting words, lines, and characters...");
    const data = {
      lines: contents.split("\n").length,
      words: contents.split(" ").length,
      charsWhite: contents.length,
      charsNoWhite: contents.replaceAll(" ", "").length,
    };

    Verbose.custom("Displaying results...");
    if (lines || all) console.log(`Lines: ${chalk.bold(data.lines)}`);
    if (words || all) console.log(`Words: ${chalk.bold(data.words)}`);

    if (chars || all) {
      // If the characters with whitespace are the same as the characters without whitespace, just show one
      if (data.charsWhite === data.charsNoWhite) {
        console.log(`Characters: ${chalk.bold(data.charsWhite)}`);
      } else {
        console.log(`Characters (including whitespace): ${chalk.bold(data.charsWhite)}`);
        console.log(`Characters (excluding whitespace): ${chalk.bold(data.charsNoWhite)}`);
      }
    }

    console.log();
  } catch (err) {
    if (err.code === "EPERM" || err.code === "EACCES") {
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

module.exports = wcount;
