const chalk = require("chalk");
const fs = require("fs");
const { basename } = require("path");

const { GLOBAL_NAME } = require("../../variables/constants");

const _nonFatalError = require("../../functions/nonFatalError");
const _promptForYN = require("../../functions/promptForYN");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const InfoMessages = require("../../classes/InfoMessages");
const Verbose = require("../../classes/Verbose");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

/**
 * Either make a symbolic link or check if a path
 * is a symbolic link or not.
 *
 * If you want to check if a path is a symbolic link,
 * you can add the `-c` flag to the end. This will check
 * if the file/directory is a symbolic link or not, and
 * will print the respective result.
 *
 * If you want to create a symbolic link, you must pass the
 * path parameter, as well as the target. This will create a
 * path (symbolic link) which points to the target
 * (not a symbolic link).
 *
 * Available arguments:
 * `-c`: Check if a path is a symbolic link.
 *
 * @param {string} target The path that the symbolic link will point to (the target).
 * @param {string} path The symbolic link to create (the path). It can also be the `-c` argument.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.ink` function.
 */
const symlink = (target, path, ...args) => {
  try {
    // Initialize the 'check' argument as it defines whether or not to convert the new path to absolute
    // Verbose.initArgs();
    // const check = args.includes("-c") || path === "-c";

    // Replace spaces and then convert to an absolute path
    // Only if 'check' is false, convert the new path
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    [target, path] = PathUtil.parseQuotes([target, path, ...args]);
    target = PathUtil.all(target, { parseQuotes: false });
    path = PathUtil.all(path, { parseQuotes: false });

    let check = false;
    if (path?.trim() === "" || typeof path === "undefined") {
      check = true;
    }

    Verbose.initChecker();
    const targetChk = new Checks(target);
    const pathChk = new Checks(path);

    Verbose.initShowPath();
    const showTarget = new SettingManager().fullOrBase(target);
    const showPath = new SettingManager().fullOrBase(path);

    if (targetChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a path/the paths", "symlink target path");
      return;
    } else if (!targetChk.doesExist()) {
      Verbose.chkExists(target);
      Errors.doesNotExist("file/directory", showTarget);
      return;
    } else if (targetChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    // If the user wanted to check if the path is a symbolic link
    if (check) {
      Verbose.custom("Checking if path is a symbolic link...");
      if (fs.lstatSync(target).isSymbolicLink()) {
        Verbose.custom("Path is a symbolic link.");
        console.log(chalk.green(`The path, ${chalk.bold(showTarget)}, is a symbolic link.`));
        console.log(chalk.green.dim(`(points to ${chalk.bold(fs.readlinkSync(target))})\n`));
      } else {
        Verbose.custom("Path is not a symbolic link.");
        console.log(chalk.red(`The path, ${chalk.bold(showTarget)}, is not a symbolic link.\n`));
      }

      return;
    }

    if (pathChk.doesExist()) {
      Verbose.promptUser();
      if (
        _promptForYN(
          `The file/directory, '${chalk.italic(
            basename(path)
          )}', already exists. Would you like to delete it?`
        )
      ) {
        try {
          Verbose.custom("Deleting the path...");
          fs.rmSync(path, { recursive: true, force: true });
          InfoMessages.success(`Successfully deleted ${chalk.bold(showPath)}.`);
        } catch (err) {
          if (err.code === "EPERM" || err.code === "EACCES") {
            Verbose.permError();
            Errors.noPermissions("delete the file/directory", showPath);
          } else if (err.code === "EBUSY") {
            Verbose.inUseError();
            Errors.inUse("file/directory", showPath);
          }

          InfoMessages.error(`Could not delete ${chalk.bold(showPath)}.`);
          return;
        }
      } else {
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }
    } else if (target === path) {
      Verbose.custom("Detected that source and target are the same...");
      InfoMessages.error("Cannot create a symbolic where the source and target are the same.");
      return;
    }

    Verbose.custom("Creating a symbolic link...");
    fs.symlinkSync(target, path);

    if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
      InfoMessages.success(
        `Successfully created the symbolic link ${chalk.bold(showPath)} that points to ${chalk.bold(
          showTarget
        )}.`
      );
    else console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showTarget = new SettingManager().fullOrBase(target);
    const showPath = new SettingManager().fullOrBase(path);

    if (err.code === "EPERM" || err.code === "EACCES") {
      // Note that on Windows (and maybe Linux/macOS), you need
      // to run it with elevated privileges to make the command work.
      Verbose.permError();
      InfoMessages.info(`Try running ${GLOBAL_NAME} with elevated privileges.`);
      Errors.noPermissions("make the symbolic link", showPath);
    } else if (err.code === "ENXIO") {
      Verbose.noDeviceError();
      Errors.noDevice(showTarget);
    } else if (err.code === "EISDIR") {
      // Occurs if system is unable to create symlink (Windows)
      Verbose.custom("Unable to create symbolic link.");
      InfoMessages.error("Failed to create a symbolic link.");
    } else if (err.code === "UNKNOWN") {
      Verbose.unknownError();
      Errors.unknown();
    } else {
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = symlink;
