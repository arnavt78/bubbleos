const chalk = require("chalk");
const fs = require("fs");

const { GLOBAL_NAME } = require("../variables/constants");

const _parseDoubleQuotes = require("../functions/parseQuotes");
const _convertAbsolute = require("../functions/convAbs");
const _caseSensitivePath = require("../functions/caseSensitivePath");
const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

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
 * `-s`: Only if you would like to create a symbolic
 * link. Silences all success messages, except for
 * error messages.
 *
 * @param {string} path The path that the symbolic link will point to (the target).
 * @param {string} newPath The symbolic link to create (the path). It can also be the `-c` argument.
 * @param {...string} args Arguments to modify the behavior of the `symlink` function.
 */
const symlink = (path, newPath, ...args) => {
  try {
    // Initialize the 'check' argument as it defines whether or not to convert the new path to absolute
    Verbose.initArgs();
    const check = args.includes("-c") || newPath === "-c";
    const silent = args.includes("-s");

    // Replace spaces and then convert to an absolute path
    // Only if 'check' is false, convert the new path
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    if (!check) {
      [path, newPath] = _parseDoubleQuotes([path, newPath, ...args]).map((p) =>
        _caseSensitivePath(_convertAbsolute(p))
      );
    } else {
      path = _caseSensitivePath(_convertAbsolute(_parseDoubleQuotes([path, newPath, ...args])[0]));
    }

    Verbose.initChecker();
    const pathChk = new Checks(path);
    const newPathChk = new Checks(newPath);

    if (pathChk.paramUndefined() || newPathChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a path/the paths", "symlink path symbol");
      return;
    } else if (!pathChk.doesExist()) {
      Verbose.chkExists(path);
      Errors.doesNotExist("file/directory", path);
      return;
    } else if (pathChk.pathUNC()) {
      Verbose.pathUNC();
      Errors.invalidUNCPath();
      return;
    }

    // If the user wanted to check if the path is a symbolic link
    if (check) {
      Verbose.custom("Checking if path is a symbolic link...");
      if (fs.lstatSync(path).isSymbolicLink()) {
        Verbose.custom("Path is a symbolic link.");
        console.log(chalk.green(`The path, ${chalk.bold(path)}, is a symbolic link.`));
        console.log(chalk.green.italic.dim(`(points to ${chalk.bold(fs.readlinkSync(path))})\n`));
      } else {
        Verbose.custom("Path is not a symbolic link.");
        console.log(chalk.red(`The path, ${chalk.bold(path)}, is not a symbolic link.\n`));
      }

      return;
    }

    Verbose.custom("Creating a symbolic link...");
    fs.symlinkSync(path, newPath);

    if (!silent)
      InfoMessages.success(
        `Successfully created the symbolic link ${chalk.bold(newPath)} that points to ${chalk.bold(
          path
        )}.`
      );
    else console.log();
  } catch (err) {
    if (err.code === "EPERM") {
      // If there are no permissions to make the symbolic link
      // Note that on Windows (and maybe Linux/macOS), you need
      // to run it with elevated privileges to make the command work.
      Verbose.permError();
      InfoMessages.info(`Try running ${GLOBAL_NAME} with elevated privileges.`);
      Errors.noPermissions("make the symbolic link", newPath);
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = symlink;
