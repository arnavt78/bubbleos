const chalk = require("chalk");
const fs = require("fs");

const { GLOBAL_NAME } = require("../variables/constants");

const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");

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
 * @param {string} path The path that the symbolic link will point to (the target).
 * @param {string} newPath The symbolic link to create (the path). It can also be the `-c` argument.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.ink` function.
 */
const symlink = (path, newPath, ...args) => {
  try {
    // Initialize the 'check' argument as it defines whether or not to convert the new path to absolute
    Verbose.initArgs();
    const check = args.includes("-c") || newPath === "-c";

    // Replace spaces and then convert to an absolute path
    // Only if 'check' is false, convert the new path
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    if (!check) {
      [path, newPath] = PathUtil.parseQuotes([path, newPath, ...args]).map((p) =>
        PathUtil.all(path, { parseQuotes: false })
      );
    } else {
      path = PathUtil.all([path, newPath, ...args]);
    }

    Verbose.initChecker();
    const pathChk = new Checks(path);
    const newPathChk = new Checks(newPath);

    Verbose.initShowPath();
    const showPath = new SettingManager().fullOrBase(path);
    const showNewPath = new SettingManager().fullOrBase(newPath);

    if (pathChk.paramUndefined() || newPathChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a path/the paths", "symlink path symbol");
      return;
    } else if (!pathChk.doesExist()) {
      Verbose.chkExists(path);
      Errors.doesNotExist("file/directory", showPath);
      return;
    } else if (pathChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    // If the user wanted to check if the path is a symbolic link
    if (check) {
      Verbose.custom("Checking if path is a symbolic link...");
      if (fs.lstatSync(path).isSymbolicLink()) {
        Verbose.custom("Path is a symbolic link.");
        console.log(chalk.green(`The path, ${chalk.bold(showPath)}, is a symbolic link.`));
        console.log(chalk.green.dim(`(points to ${chalk.bold(fs.readlinkSync(path))})\n`));
      } else {
        Verbose.custom("Path is not a symbolic link.");
        console.log(chalk.red(`The path, ${chalk.bold(showPath)}, is not a symbolic link.\n`));
      }

      return;
    }

    Verbose.custom("Creating a symbolic link...");
    fs.symlinkSync(path, newPath);

    if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
      InfoMessages.success(
        `Successfully created the symbolic link ${chalk.bold(
          showNewPath
        )} that points to ${chalk.bold(showPath)}.`
      );
    else console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showPath = new SettingManager().fullOrBase(path);
    const showNewPath = new SettingManager().fullOrBase(newPath);

    if (err.code === "EPERM" || err.code === "EACCES") {
      // If there are no permissions to make the symbolic link
      // Note that on Windows (and maybe Linux/macOS), you need
      // to run it with elevated privileges to make the command work.
      Verbose.permError();
      InfoMessages.info(`Try running ${GLOBAL_NAME} with elevated privileges.`);
      Errors.noPermissions("make the symbolic link", showNewPath);
    } else if (err.code === "ENXIO") {
      Verbose.noDeviceError();
      Errors.noDevice(showPath);
    } else if (err.code === "UNKNOWN") {
      Verbose.unknownError();
      Errors.unknown();
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = symlink;
