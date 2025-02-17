const chalk = require("chalk");
const fs = require("fs");

const _promptForYN = require("../functions/promptForYN");
const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");

/**
 * Renames a file for use in the BubbleOS shell.
 *
 * Note that the old name and the new name cannot be
 * the same name. Also, if the new name already exists,
 * BubbleOS will confirm that the file should be
 * overwritten.
 *
 * Available arguments:
 * - `-y`: Automatically accept the overwriting prompt if the
 * new file already exists.
 * - `-s`: Silently rename the directory (don't output the
 * confirmation prompt). Error messages will still be shown.
 *
 * @param {string} oldName The old name of the file.
 * @param {string} newName The new name of the file.
 * @param {...string} args Arguments to modify the behavior of `rename`. Available arguments are above.
 */
const rename = (oldName, newName, ...args) => {
  try {
    // Replace spaces and then convert the path to an absolute one to both the old and new names
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    [oldName, newName] = PathUtil.parseQuotes([oldName, newName, ...args]).map((path) =>
      PathUtil.all(path, { parseQuotes: false })
    );

    Verbose.initChecker();
    const oldChk = new Checks(oldName);
    const newChk = new Checks(newName);

    const showOldName = new SettingManager().fullOrBase(oldName);
    const showNewName = new SettingManager().fullOrBase(newName);

    Verbose.initArgs();
    const confirm = !args?.includes("-y");
    const silent = args?.includes("-s");

    if (oldChk.paramUndefined() || newChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("the old name and the new name", "rename old.txt new.txt");
      return;
    }

    if (oldName === newName) {
      console.log(chalk.yellow("The old and new names cannot be the same.\nProcess aborted.\n"));
      return;
    }

    if (!oldChk.doesExist()) {
      Verbose.chkExists(oldName);
      Errors.doesNotExist("file", showOldName);
      return;
    } else if (oldChk.pathUNC() || newChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    if (confirm && newChk.doesExist()) {
      Verbose.promptUser();
      if (
        !_promptForYN(
          `The file/directory, ${chalk.bold(
            showNewName
          )} exists and will be overwritten. Do you want to continue?`
        )
      ) {
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }
    }

    Verbose.custom("Renaming the file/directory...");
    fs.renameSync(oldName, newName);

    // If the user did not want output, only show a newline, else, show the success message
    if (!silent)
      InfoMessages.success(
        `Successfully renamed ${chalk.bold(showOldName)} to ${chalk.bold(showNewName)}.`
      );
    else console.log();
  } catch (err) {
    const showOldName = new SettingManager().fullOrBase(oldName);
    const showNewName = new SettingManager().fullOrBase(newName);

    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("rename the file/directory", `${showOldName}/${showNewName}`);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file/directory", `${showOldName}/${showNewName}`);
    } else if (err.code === "ENAMETOOLONG") {
      // The name is too long
      // This code only seems to appear on Linux and macOS
      // On Windows, the code is 'EINVAL'
      Verbose.custom("The file name was detected to be too long.");
      Errors.pathTooLong(showNewName);
    } else if (err.code === "EINVAL") {
      // Invalid characters; basically just goes for Windows
      // NTFS' file system character limitations
      // However, Windows also uses this code when the file
      // path exceeds 260 characters, or when the file name
      // exceeds 255 characters
      Verbose.custom("The file name was detected to contain invalid characters, or is too long.");
      Errors.invalidCharacters(
        "directory name",
        "valid path characters",
        "characters such as '?' or ':' (Windows only)",
        showNewName
      );
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = rename;
