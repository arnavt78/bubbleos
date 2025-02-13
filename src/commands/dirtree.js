const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");
const PathUtil = require("../classes/PathUtil");

/**
 * Internal helper function to generate the tree for `dirtree`.
 *
 * @param {string} currentDir Directory to begin the tree in.
 * @param {string} prefix It is prefered to leave this to the default value.
 */
const _generateTree = (currentDir, prefix = "") => {
  let items;

  try {
    // Attempt to read the directory contents
    Verbose.custom(`Reading directory contents of '${currentDir}'...`);
    items = fs.readdirSync(currentDir);
  } catch (err) {
    // On error, skip this directory
    Verbose.custom("Encountered an error while reading directory; skipping...");
    console.log(chalk.red(`${prefix}└── [ERROR] Unable to access: ${currentDir}`));
    return;
  }

  items.forEach((item, index) => {
    const itemPath = path.join(currentDir, item);
    const isLastItem = index === items.length - 1;

    try {
      Verbose.custom(`Checking if '${itemPath}' is a directory...`);
      const isDirectory = fs.statSync(itemPath).isDirectory();

      // Print the item with the tree-like structure
      Verbose.custom("Printing item...");
      console.log(`${prefix}${isLastItem ? "└── " : "├── "}${item}`);

      if (isDirectory) {
        // Update the prefix for the next level
        Verbose.custom("Path is directory, recalling tree generation...");
        const newPrefix = prefix + (isLastItem ? "    " : "│   ");
        _generateTree(itemPath, newPrefix);
      }
    } catch (err) {
      // Handle inaccessible files or directories
      Verbose.custom(`Encountered an error while trying to read ${itemPath}.`);
      console.log(
        chalk.red(`${prefix}${isLastItem ? "└──" : "├──"} [ERROR] Unable to access: ${item}`)
      );
    }
  });
};

/**
 * Generate a directory tree, showing a visual representation of the directories
 * and files inside of a directory, as well as nested ones.
 *
 * The command is visually identical to the Windows `tree` command.
 *
 * @param {string} dir The directory to start the tree in.
 * @param {...string} args Arguments to change the behavior of `dirtree`.
 */
const dirtree = (dir = process.cwd(), ...args) => {
  try {
    // Converts path into case-sensitive path for Windows, and resolves spaces
    Verbose.parseQuotes();
    dir = PathUtil.all([dir, ...args], { convertAbsolute: false });

    Verbose.initChecker();
    const dirChk = new Checks(dir);

    if (!dirChk.doesExist()) {
      Verbose.chkExists();
      Errors.doesNotExist("folder", dir);
      return;
    } else if (!dirChk.validateType()) {
      Verbose.chkType(dir, "directory");
      Errors.expectedDir(dir);
      return;
    } else if (dirChk.pathUNC()) {
      Errors.invalidUNCPath();
      return;
    }

    // Start the tree generation
    Verbose.custom("Logging current directory...");
    console.log(chalk.bold(PathUtil.convertAbsolute(dir)));
    Verbose.custom("Starting tree generation...");
    _generateTree(dir);
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = dirtree;
