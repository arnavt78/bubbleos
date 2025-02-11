const chalk = require("chalk");
const fs = require("fs");

const _convertAbsolute = require("../functions/convAbs");
const _parseDoubleQuotes = require("../functions/parseQuotes");
const _promptForYN = require("../functions/promptForYN");
const _fatalError = require("../functions/fatalError");
const _getSize = require("../functions/getSize");
const _caseSensitivePath = require("../functions/caseSensitivePath");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");
const InfoMessages = require("../classes/InfoMessages");

/**
 * The size of the file/directory in bytes before showing a "this may take a while" message.
 */
const SIZE_TO_SHOW_DIALOG = 262_144_000;

/**
 * Synchronously copy a directory from the source (`src`)
 * to the destination (`dest`). This is a BubbleOS command
 * function for the command `copy` (which used to be
 * `copydir` and `copyfile` before it was combined).
 *
 * There is a bug in this command where it can throw an error
 * when copying a file to another file, and that file already exists.
 * It does not happen everywhere, and is extremely hard to recreate,
 * so it should not be an issue for build 100. But, the issue is that
 * sometimes, when attempting to copy a file to another directory which
 * has a file with the same name as the source, an error will occur (with
 * a technical error code of `ERR_FS_CP_DIR_TO_NON_DIR`). This (for me) makes
 * no sense, but it occurs in the `fs.cpSync()` function, so the check for the
 * directory results in it thinking that the source is a destination, when
 * really, it is a file. This should be fixed hopefully soon, but as said
 * before, it is very hard to recreate, so users should not face this issue
 * that often.
 *
 * Available arguments:
 * - `-s`: Silently copy the source to the destination and silence all success
 * messages to the standard output. Only errors can be logged.
 * - `-y`: Copy the file/directory to the destination even if it already exists
 * and is in danger of being overwritten.
 * - `-t`: **Only for directory copying!** Keeps the timestamps of all files and
 * directories to their last modified date, instead of modifying it when the directory
 * has been copied.
 * - `--rm-symlink`: **Only for directory copying!** If a symbolic link exists in
 * the directory, this flag will remove it and replace it with a copy of the actual
 * contents of the file/directory it was pointing to.
 *
 * @param {string} src The source file/directory that should be copied.
 * @param {string} dest The destination that the source should be copied to.
 * @param {...string} args Arguments to modify the behavior of `copy()`. The available arguments are listed above.
 */
const copy = (src, dest, ...args) => {
  try {
    // Replace spaces and then convert the path to an absolute one to both the source and destination paths
    Verbose.parseQuotes();
    Verbose.pathAbsolute(src);
    Verbose.pathAbsolute(dest);
    [src, dest] = _parseDoubleQuotes([src, dest, ...args])
      .map(_convertAbsolute)
      .map(_caseSensitivePath);

    Verbose.initChecker();
    const srcChk = new Checks(src);
    const destChk = new Checks(dest);

    Verbose.initArgs();
    const silent = args?.includes("-s");
    const confirmCopy = !args.includes("-y");
    const keepTimes = args?.includes("-t");
    const rmSymlinkReference = args?.includes("--rm-symlink");

    if (srcChk.paramUndefined() || destChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("the source/destination", "copy src dest");
      return;
    }

    if (!srcChk.doesExist()) {
      Verbose.chkExists(src);
      Errors.doesNotExist("source", src);
      return;
    } else if (srcChk.pathUNC()) {
      Errors.invalidUNCPath();
      return;
    }

    // If destination exists, confirm user wants to delete it
    if (confirmCopy && destChk.doesExist()) {
      Verbose.custom(
        `Destination path '${dest}' exists, confirming if user wants to overwrite it...`
      );
      if (
        !_promptForYN(
          `The file/directory, ${chalk.bold(
            dest
          )} exists and will be overwritten. Do you want to continue?`
        )
      ) {
        Verbose.declinePrompt();
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }

      console.log();
    }

    if (srcChk.validateType()) {
      // If the path is a directory
      // TODO there is an error where ERR_FS_CP_DIR_TO_NON_DIR
      // will appear even if the paths are files

      // If size of directory is over 250MB, show "may take a while" message
      Verbose.custom("Getting size of directory...");
      if (!silent && _getSize(src, "directory") >= SIZE_TO_SHOW_DIALOG)
        console.log(chalk.italic.blueBright("Please wait; this may take a while..."));

      // TODO if needed, see if there are more options
      Verbose.custom("Copying directory...");
      fs.cpSync(src, dest, {
        recursive: true,
        dereference: rmSymlinkReference,
        preserveTimestamps: keepTimes,
      });
    } else {
      // If size of directory is over 250MB, show "may take a while" message
      Verbose.custom("Getting size of file...");
      if (!silent && _getSize(src, "file") >= SIZE_TO_SHOW_DIALOG)
        console.log(chalk.italic.blueBright("Please wait; this may take a while..."));

      Verbose.custom("Copying file...");
      fs.copyFileSync(src, dest);
    }

    if (!silent)
      InfoMessages.success(`Successfully copied to ${chalk.bold(src)} to ${chalk.bold(dest)}.`);
    else console.log();
  } catch (err) {
    if (err.code === "EPERM") {
      Verbose.permError();
      Errors.noPermissions("copy", src);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file/directory", `${src} and/or ${dest}`);
    } else if (err.code === "EISDIR") {
      // If the user attempted to copy a file to a directory
      Verbose.chkType(dest, "file");
      Errors.expectedFile(dest);
    } else if (err.code === "ENOTDIR") {
      // If the user attempted to copy a directory to a file
      Verbose.chkType(dest, "directory");
      Errors.expectedDir(dest);
    } else if (err.code === "ERR_FS_CP_DIR_TO_NON_DIR") {
      // If the user attempted to copy a directory to a non-directory

      // There is also a bug in BubbleOS which can do the same thing.
      // It seems kind of random to me; it only happened once in
      // my testing, even without changing the code. It seems to happen
      // in fs.cpSync(). Fix it please!
      Verbose.custom("Error copying a directory to a non-directory...");

      // REMOVE IN BUILD 200?
      InfoMessages.warning(
        "IF YOU ENCOUNTERED THIS ISSUE: Make a new issue on Github (https://github.com/arnavt78/bubbleos/issues/new) detailing exactly what you did to get this issue."
      );

      Errors.dirToNonDir();
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = copy;
