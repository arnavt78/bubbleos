const chalk = require("chalk");
const fs = require("fs");

const _promptForYN = require("../../functions/promptForYN");
const _nonFatalError = require("../../functions/nonFatalError");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const Verbose = require("../../classes/Verbose");
const InfoMessages = require("../../classes/InfoMessages");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

/**
 * Synchronously copy a directory from the source (`src`)
 * to the destination (`dest`).
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
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const copy = (src, dest, ...args) => {
  try {
    // Replace spaces and then convert the path to an absolute one to both the source and destination paths
    Verbose.parseQuotes();
    Verbose.pathAbsolute(src);
    Verbose.pathAbsolute(dest);

    // Don't use PathUtil.all() because it doesn't work well with double paths
    [src, dest] = PathUtil.parseQuotes([src, dest, ...args])
      .map(PathUtil.homeDir)
      .map(PathUtil.convertAbsolute)
      .map(PathUtil.caseSensitive);

    Verbose.initChecker();
    const srcChk = new Checks(src);
    const destChk = new Checks(dest);

    Verbose.initShowPath();
    const showSrc = new SettingManager().fullOrBase(src);
    const showDest = new SettingManager().fullOrBase(dest);

    Verbose.initArgs();
    const confirmCopy = !args.includes("-y");
    const keepTimes = args.includes("-t");
    const rmSymlinkReference = args.includes("--rm-symlink");

    if (srcChk.paramUndefined() || destChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("the source/destination", "copy src dest");
      return;
    }

    if (!srcChk.doesExist()) {
      Verbose.chkExists(src);
      Errors.doesNotExist("source", showSrc);
      return;
    } else if (srcChk.pathUNC()) {
      Verbose.chkUNC();
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
            showDest
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

      // TODO if needed, see if there are more options
      Verbose.custom("Copying directory...");
      fs.cpSync(src, dest, {
        recursive: true,
        dereference: rmSymlinkReference,
        preserveTimestamps: keepTimes,
      });
    } else {
      Verbose.custom("Copying file...");
      fs.copyFileSync(src, dest);
    }

    if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
      InfoMessages.success(
        `Successfully copied to ${chalk.bold(showSrc)} to ${chalk.bold(showDest)}.`
      );
    else console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showSrc = new SettingManager().fullOrBase(src);
    const showDest = new SettingManager().fullOrBase(dest);

    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("copy", showSrc);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file/directory", `${showSrc} and/or ${showDest}`);
    } else if (err.code === "EISDIR") {
      // If the user attempted to copy a file to a directory
      Verbose.chkType(dest, "file");
      Errors.expectedFile(showDest);
    } else if (err.code === "ENOTDIR") {
      // If the user attempted to copy a directory to a file
      Verbose.chkType(dest, "directory");
      Errors.expectedDir(showDest);
    } else if (err.code === "ENXIO") {
      Verbose.noDeviceError();
      Errors.noDevice(showSrc);
    } else if (err.code === "ERR_FS_CP_EINVAL") {
      // If the user attempted to copy a file/directory to a subdirectory of itself
      Verbose.custom("Error copying a file/directory to a subdirectory of itself...");
      InfoMessages.error("Cannot copy the file/directory to a subdirectory of itself.");
    } else if (err.code === "ERR_FS_CP_DIR_TO_NON_DIR") {
      // If the user attempted to copy a directory to a non-directory

      // There is also a bug in BubbleOS which can do the same thing.
      // It seems kind of random to me; it only happened once in
      // my testing, even without changing the code. It seems to happen
      // in fs.cpSync().
      Verbose.custom("Error copying a directory to a non-directory...");
      InfoMessages.error("Cannot overwrite a directory with a non-directory.");
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

module.exports = copy;
