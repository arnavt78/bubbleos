const chalk = require("chalk");
const fs = require("fs");

const _nonFatalError = require("../../functions/nonFatalError");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const Verbose = require("../../classes/Verbose");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

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
 *
 * @param {[ { name: string, type: string, isSymlink: boolean } ]} contents An array of objects containing information about the files/directories.
 * @param {{ short: boolean, max: boolean }} options Options to modify the behavior of `_logDirContents()`.
 * @returns A string with the final value.
 */
const _logDirContents = (contents, options = { short: false }) => {
  let dirStr = "";

  // Compute max length for short view (longest name + 5)
  const maxLength = Math.max(...contents.map((item) => item.name.length), 0) + 5;

  contents.forEach((item, index) => {
    const { type, name, isSymlink } = item;
    const isHidden = name.startsWith(".") || name.startsWith("_") || name.startsWith("$");

    Verbose.custom(`Item #${index + 1} of directory.`);

    // Apply padding before styling
    const paddedName = options.short ? name.padEnd(maxLength) : name;

    // Determine chalk style based on type
    let styledName;
    switch (true) {
      case type === "file" && isSymlink:
        Verbose.custom("Item is a file and symbolic link...");
        styledName = chalk.red(paddedName);
        break;
      case type === "directory" && isSymlink:
        Verbose.custom("Item is a directory and symbolic link...");
        styledName = chalk.bold.red(paddedName);
        break;
      case type === "file":
        Verbose.custom("Item is a file...");
        styledName = chalk.green(paddedName);
        break;
      case type === "directory" && isHidden:
        Verbose.custom("Item is a hidden directory...");
        styledName = chalk.bold.gray(paddedName);
        break;
      case type === "directory":
        Verbose.custom("Item is a directory...");
        styledName = chalk.bold.blue(paddedName);
        break;
      default:
        Verbose.custom(`Item '${type}' is unknown...`);
        styledName = chalk.italic(paddedName);
    }

    dirStr += styledName;

    // Handle line breaks
    if (options.short && (index + 1) % 3 === 0) {
      Verbose.custom("Three rows and short view, making new column...");
      dirStr += "\n";
    } else if (!options.short && index !== contents.length - 1) {
      dirStr += "\n";
    }
  });

  return dirStr + "\n";
};

/**
 * List the contents of a directory.
 *
 * There is a known bug where the contents, if viewed
 * in short view, will look a bit 'off' if a file or
 * directory in the directory has a lot of characters.
 *
 * Available arguments:
 * - `-s`: View the contents in a shorter view
 * (rows/columns).
 *
 * @param {string} dir Optional: the directory to view the contents in. By default, it uses the current working directory.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const ls = (dir = `"${process.cwd()}"`, ...args) => {
  try {
    Verbose.initArgs();
    let short = args.includes("-s") || dir === "-s";
    if (dir === "-s") dir = process.cwd();

    Verbose.parseQuotes();
    dir = PathUtil.all([dir, ...args], { convertAbsolute: false });

    Verbose.initChecker();
    const dirChk = new Checks(dir);

    Verbose.initShowPath();
    const showDir = new SettingManager().fullOrBase(dir);

    if (!dirChk.doesExist()) {
      Verbose.chkExists(dir);
      Errors.doesNotExist("directory", showDir);
      return;
    } else if (!dirChk.validateType()) {
      Verbose.chkType(dir, "directory");
      Errors.expectedDir(showDir);
      return;
    } else if (dirChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    // Get all properties about each file and directory in a directory
    Verbose.custom("Getting properties of all file and directories...");
    const items = fs
      .readdirSync(dir, { withFileTypes: true })
      .map((item) => ({
        name: item.name,
        type: item.isDirectory() ? "directory" : "file",
        isSymlink: item.isSymbolicLink(),
      }))
      .sort();

    // Filter all items by 'directory' first and then 'file'
    Verbose.custom("Sorting items by directory first and then files...");
    const all = items
      .filter((item) => item.type === "directory")
      .concat(items.filter((item) => item.type === "file"));

    // If there is nothing in the directory
    if (all.length === 0) {
      Verbose.custom("No files or directories were detected in the directory...");
      console.log(chalk.yellow("There are no files/directories in the directory.\n"));
      return;
    }

    if (short) {
      Verbose.custom("Logging directory contents in short form...");
      console.log(_logDirContents(all, { short }));
    } else {
      Verbose.custom("Logging directory contents in long form...");
      console.log(_logDirContents(all, { short }));
    }
  } catch (err) {
    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("read", showDir);
    } else if (err.code === "ENOENT") {
      // For some reason, there are rare cases where the checks think the directory exists,
      // but when trying to list the contents, it throws an error.
      // This usually happens when using the BubbleOS executable, where a directory called
      // "C:\snapshot" is visible on Windows (through 'ls' in BubbleOS), but when trying to
      // list it, it throws an error.

      Verbose.custom("Directory does not exist.");
      Errors.doesNotExist("directory", showDir);
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

module.exports = ls;
