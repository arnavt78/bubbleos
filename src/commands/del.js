const chalk = require("chalk");
const fs = require("fs");

const _parseDoubleQuotes = require("../functions/parseQuotes");
const _convertAbsolute = require("../functions/convAbs");
const _promptForYN = require("../functions/promptForYN");
const _fatalError = require("../functions/fatalError");
const _caseSensitivePath = require("../functions/caseSensitivePath");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const ConfigManager = require("../classes/ConfigManager");

/**
 * Delete a file/directory from BubbleOS. This is a CLI function.
 * Synchronously deletes a file/directory using the `fs.rmSync()`
 * function.
 *
 * This command used to be in two separate commands/functions -
 * `rmdir` (removes a directory; empty or not) and `rmfile`
 * (removes a file). This command combines the two and can
 * delete all files, directories, and empty directories (so
 * you do not need to use a separate command to delete an empty
 * directory).
 *
 * Available arguments:
 * - `-s`: Silently delete the path that the user requested. This
 * means that the success message will not be shown, but error
 * messages will still be outputted.
 * - `-y`: Automatically accepts the confirmation prompt
 * before deleting a file.
 *
 * @param {string} path The relative or absolute path to the file/directory to delete.
 * @param {...string} args The arguments to modify the behavior of the `del` command. See all available arguments above.
 */
const del = (path, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    path = _caseSensitivePath(_convertAbsolute(_parseDoubleQuotes([path, ...args])[0]));

    Verbose.initChecker();
    const pathChk = new Checks(path);

    Verbose.initArgs();
    const silent = args?.includes("-s");
    const confirmDel = !args?.includes("-y");

    if (pathChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file/directory", "del test");
      return;
    }

    if (!pathChk.doesExist()) {
      Verbose.chkExists();
      Errors.doesNotExist("file/directory", path);
      return;
    } else if (pathChk.pathUNC()) {
      Errors.invalidUNCPath();
      return;
    } else if (new ConfigManager().isConfig(path)) {
      // Prevents the user from deleting the configuration file
      Errors.inUse("file", path);
      return;
    }

    // Confirms user wants to delete path
    if (confirmDel) {
      Verbose.promptUser();
      if (!_promptForYN(`Are you sure you want to permanently delete ${chalk.bold(path)}?`)) {
        Verbose.declinePrompt();
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }
    }

    // Deletes the file/directory
    Verbose.custom(`Deleting file/directory '${path}'...`);
    fs.rmSync(path, { recursive: true, force: true });

    if (!silent) InfoMessages.success(`Successfully deleted ${chalk.bold(path)}.`);
    else console.log();
  } catch (err) {
    if (err.code === "EPERM") {
      Verbose.permError();
      Errors.noPermissions("delete the file/directory", path);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file/directory", path);
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = del;
