const chalk = require("chalk");
const fs = require("fs");

const _nonFatalError = require("../../functions/nonFatalError");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const Verbose = require("../../classes/Verbose");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

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
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const wcount = (file, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute(file);
    Verbose.parseQuotes();
    file = PathUtil.all([file, ...args]);

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    Verbose.initArgs();
    const lines = args.includes("-l");
    const words = args.includes("-w");
    const chars = args.includes("-c");

    const all = !lines && !words && !chars;

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "wcount text.txt");
      return;
    } else if (!fileChk.doesExist()) {
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
    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("read the file", showFile);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file", showFile);
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

module.exports = wcount;
