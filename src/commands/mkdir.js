const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const _parseDoubleQuotes = require("../functions/parseQuotes");
const _convertAbsolute = require("../functions/convAbs");
const _caseSensitivePath = require("../functions/caseSensitivePath");
const _fatalError = require("../functions/fatalError");
const _promptForYN = require("../functions/promptForYN");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

/**
 * Make a directory synchronously. This is meant
 * to be used in the BubbleOS CLI shell, and not
 * during normal coding operations.
 *
 * This command uses the `recursive` option, which
 * means that in the case of a parent directory
 * not being defined, BubbleOS will automatically
 * create it. The function being used to create the
 * directories is `fs.mkdirSync()`.
 *
 * Note that there is a small hiccup in the error
 * codes, where if the path/file names are too long,
 * Linux and macOS will show the error code correctly
 * as `ENAMETOOLONG`, but Windows will show it as
 * `EINVAL`.
 *
 * Available arguments:
 * - `-s`: Silence all outputs to the standard output,
 * which includes the success message. Only error
 * messages are shown.
 *
 * @param {string} dir The directory/directories that should be created. Both absolute and relative directories are accepted.
 * @param {...string} args Arguments to change the behavior of `mkdir()`. Available arguments are listed above.
 */
const mkdir = (dir, ...args) => {
  try {
    // Converts directory to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute(dir);
    Verbose.parseQuotes();
    dir = _caseSensitivePath(_convertAbsolute(_parseDoubleQuotes([dir, ...args])[0]));

    Verbose.initChecker();
    const dirChk = new Checks(dir);

    Verbose.initArgs();
    const silent = args?.includes("-s");

    if (dirChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a directory", "mkdir test");
      return;
    }

    if (dirChk.doesExist()) {
      Verbose.promptUser();
      if (
        _promptForYN(
          `The directory, '${chalk.italic(
            path.basename(dir)
          )}', already exists. Would you like to delete it?`
        )
      ) {
        try {
          Verbose.custom("Deleting the directory...");
          fs.rmSync(dir, { recursive: true, force: true });
          InfoMessages.success(`Successfully deleted ${chalk.bold(dir)}.`);
        } catch {
          if (err.code === "EPERM") {
            Verbose.permError();
            Errors.noPermissions("delete the directory", dir);
          } else if (err.code === "EBUSY") {
            Verbose.inUseError();
            Errors.inUse("directory", dir);
          }

          return;
        }
      } else {
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }
    }

    if (dirChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    // Make the directory
    // The recursive option makes all parent directories
    // in the case that they don't exist
    Verbose.custom("Creating the directory...");
    fs.mkdirSync(dir, { recursive: true });

    // If the user didn't request for silence, show the success message, else, show a newline
    if (!silent) InfoMessages.success(`Successfully made the directory ${chalk.bold(dir)}.`);
    else console.log();
  } catch (err) {
    if (err.code === "ENOENT") {
      // In the case that the recursive option is disabled,
      // throw an error if a parent directory does not exist
      Verbose.chkExists(dir);
      Errors.doesNotExist("directory", dir);
    } else if (err.code === "EPERM") {
      Verbose.permError();
      Errors.noPermissions("create the directory", dir);
    } else if (err.code === "ENAMETOOLONG") {
      // The name is too long
      // This code only seems to appear on Linux and macOS
      // On Windows, the code is 'EINVAL'
      Verbose.custom("The directory name was detected to be too long.");
      Errors.pathTooLong(dir);
    } else if (err.code === "EINVAL") {
      // Invalid characters; basically just goes for Windows
      // NTFS' file system character limitations
      // However, Windows also uses this code when the file
      // path exceeds 260 characters, or when the file name
      // exceeds 255 characters
      Verbose.custom(
        "The directory name was detected to contain invalid characters, or is too long."
      );
      Errors.invalidCharacters(
        "directory name",
        "valid path characters",
        "characters such as '?' or ':' (Windows only)",
        dir
      );
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = mkdir;
