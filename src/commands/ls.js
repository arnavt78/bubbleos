const chalk = require("chalk");
const fs = require("fs");

const _parseDoubleQuotes = require("../functions/parseQuotes");
const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");

/**
 * Log the directory contents.
 *
 * Format the contents of the directory depending
 * on options, such as if the user wanted to
 * view the directory in a short view.
 *
 * Options:
 * - `short`: If the directory should be in a short
 * view or not. Default: `false`.
 * - `max`: Only applies if `short` is `true`. The
 * maximum padding to the end of each item.
 *
 * @param {[ { name: string, type: string, isSymlink: boolean } ]} contents An array of objects containing information about the files/directories.
 * @param {{ short: boolean, max: boolean }} options Options to modify the behavior of `_logDirContents()`.
 * @returns A string with the final value.
 */
const _logDirContents = (contents, options = { short: false, max: undefined }) => {
  let dirStr = "";

  for (let i = 1; i < Object.keys(contents).length + 1; i++) {
    Verbose.custom(`Item #${i} of directory.`);
    let item = contents[i - 1];

    if (item.type === "file" && item.isSymlink) {
      // Is file and is a symbolic link
      Verbose.custom("Item is a file and symbolic link...");
      if (options.short) dirStr += chalk.red(item.name).padEnd(options.max);
      else dirStr += chalk.red(item.name);
    } else if (item.type === "folder" && item.isSymlink) {
      // Is folder and is symbolic link
      Verbose.custom("Item is a folder and symbolic link...");
      if (options.short) dirStr += chalk.bgRed(` ${item.name} `).padEnd(options.max);
      else dirStr += chalk.bold.red(item.name);
    } else if (item.type === "file") {
      // Is file
      Verbose.custom("Item is a file...");
      if (options.short) dirStr += chalk.green(item.name).padEnd(options.max);
      else dirStr += chalk.green(item.name);
    } else if (
      item.type === "folder" &&
      (item.name.startsWith(".") || item.name.startsWith("_") || item.name.startsWith("$"))
    ) {
      // Is folder and is most likely hidden
      Verbose.custom("Item is a hidden folder...");
      if (options.short) dirStr += chalk.bgGrey(` ${item.name} `).padEnd(options.max);
      else dirStr += chalk.bold.grey(item.name);
    } else if (item.type === "folder") {
      // Is folder
      Verbose.custom("Item is a folder...");
      if (options.short) dirStr += chalk.bgBlue(` ${item.name} `).padEnd(options.max);
      else dirStr += chalk.bold.blue(item.name);
    } else {
      // Unknown type
      Verbose.custom(`Item '${item.type}' is unknown...`);
      if (options.short) dirStr += chalk.italic(item.name).padEnd(options.max);
      else dirStr += chalk.italic(item.name);
    }

    if (i % 3 === 0 && options.short) {
      // If there are already three rows and the user requested a short view, make a new column
      Verbose.custom("Three rows and short view, making new column...");
      dirStr += "\n";
    } else if (!options.short && i !== Object.keys(contents).length) {
      // If the user wanted the normal view and 'i' is not the final occurrence
      dirStr += "\n";
    }
  }

  return dirStr + "\n";
};

/**
 * List the contents of a directory. For use in the
 * BubbleOS CLI shell only!
 *
 * There is a known bug where the contents, if viewed
 * in short view, will look a bit 'off' if a file or
 * directory in the directory has a lot of characters.
 * This will be fixed in the next released version. (yeah right)
 *
 * Available arguments:
 * - `-s`: View the contents in a shorter view
 * (rows/columns).
 *
 * @param {string} dir Optional: the directory to view the contents in. By default, it uses the current working directory.
 * @param {...string} args Arguments to change the behavior of `ls`.
 */
const ls = (dir = `"${process.cwd()}"`, ...args) => {
  try {
    Verbose.initArgs();
    let short = args.includes("-s") || dir === "-s";
    if (dir === "-s") dir = process.cwd();

    Verbose.parseQuotes();
    dir = _parseDoubleQuotes([dir, ...args])[0];

    Verbose.initChecker();
    const dirChk = new Checks(dir);

    if (!dirChk.doesExist()) {
      Verbose.chkExists(dir);
      Errors.doesNotExist("folder", dir);
      return;
    } else if (!dirChk.validateType()) {
      Verbose.chkType(dir, "directory");
      Errors.expectedDir(dir);
      return;
    } else if (dirChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    // Get all properties about each file and directory in a directory
    Verbose.custom("Getting properties of all file and folders in directory...");
    const items = fs
      .readdirSync(dir, { withFileTypes: true })
      .map((item) => ({
        name: item.name,
        type: item.isDirectory() ? "folder" : "file",
        isSymlink: item.isSymbolicLink(),
      }))
      .sort();

    // Filter all items by 'folder' first and then 'file'
    Verbose.custom("Sorting items by folder first and then files...");
    const all = items
      .filter((item) => item.type === "folder")
      .concat(items.filter((item) => item.type === "file"));

    // If there is nothing in the directory
    if (all.length === 0) {
      Verbose.custom("No files or folders were detected in the directory...");
      console.log(chalk.yellow("There are no files/directories in the directory.\n"));
      return;
    }

    const options = { short };
    if (short) {
      // If the user wanted a short view, find the longest filename for the file/directory
      Verbose.custom("Finding longest file/folder name...");
      const maxLength = Math.max(...all.map((el) => el.name.length));
      options.max = maxLength * 2;

      Verbose.custom("Logging directory contents in short form...");
      console.log(_logDirContents(all, options));
    } else {
      Verbose.custom("Logging directory contents in long form...");
      console.log(_logDirContents(all, options));
    }
  } catch (err) {
    if (err.code === "EPERM") {
      Verbose.permError();
      Errors.noPermissions("read", dir);
      return;
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = ls;
