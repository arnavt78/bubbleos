const chalk = require("chalk");
const fs = require("fs");

const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");
const InfoMessages = require("../classes/InfoMessages");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");
const ConfigManager = require("../classes/ConfigManager");

/**
 * The `cd` command, used to change into a directory.
 *
 * Note that changing a directory in BubbleOS does not reflect in the terminal
 * session when BubbleOS is exited out of.
 *
 * @param {string} dir The directory to change into. Must be a valid directory.
 * @param {...string} args The arguments that can be passed to modify the behavior of the command.
 */
const cd = (dir, ...args) => {
  try {
    // Converts path into case-sensitive path for Windows, and resolves spaces
    Verbose.parseQuotes();
    dir = PathUtil.all([dir, ...args], { convertAbsolute: false });

    Verbose.initChecker();
    const dirChk = new Checks(dir);

    const showDir = new SettingManager().fullOrBase(dir);

    Verbose.initArgs();
    const silent = args?.includes("-s");

    if (dirChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a directory", "cd test");
      return;
    }

    const config = new ConfigManager();

    if (dir.endsWith("-")) {
      const lastDir = config.getConfig()?.cd?.lastDir;

      if (typeof lastDir === "undefined") {
        InfoMessages.error("Could not get previous directory.");
        return;
      }

      // Retrieve the second-to-last directory, if available
      const secondLastDir = config.getConfig()?.cd?.secondLastDir;

      if (typeof secondLastDir === "undefined") {
        InfoMessages.error("Could not get second last directory.");
        return;
      }

      // Change to the second last directory
      process.chdir(secondLastDir);
      if (!silent)
        InfoMessages.success(
          `Successfully changed the directory to ${chalk.bold(
            new SettingManager().fullOrBase(secondLastDir)
          )}.`
        );
      else console.log();
      return;
    }

    // Update the config to save the current and previous directories
    const currentDir = dir;
    const previousDir = config.getConfig()?.cd?.lastDir || currentDir;
    config.addData({ cd: { lastDir: currentDir, secondLastDir: previousDir } });

    if (!dirChk.doesExist()) {
      Verbose.chkExists(dir);
      Errors.doesNotExist("directory", showDir);
      return;
    } else if (dirChk.pathUNC()) {
      Errors.invalidUNCPath();
      return;
    }

    // Checks if path is a symbolic link to see where it is pointing if it is
    Verbose.custom("Checking if path is a symbolic link...");
    const isSymlink = fs.lstatSync(dir).isSymbolicLink();

    if (isSymlink) {
      Verbose.custom("Path is a symbolic link; finding where it is pointing to...");
      const symlinkPath = fs.readlinkSync(dir);

      const showSymlink = new SettingManager().fullOrBase(symlinkPath);

      // If the path it is pointing to is a file, throw an error
      if (!new Checks(symlinkPath).validateType()) {
        Verbose.custom("Symbolic link points to a file.");
        Errors.expectedDir(showSymlink);
        return;
      }

      // Change the directory to the symbolic link pointing path
      Verbose.custom(
        `Changing directory to the specified destination '${chalk.italic(
          symlinkPath
        )}' (symbolic link)...`
      );
      process.chdir(symlinkPath);

      if (!silent)
        InfoMessages.success(`Successfully changed the directory to ${chalk.bold(showSymlink)}.`);
      else console.log();
    } else if (dirChk.validateType()) {
      // If not a symlink, change directory normally
      Verbose.custom(
        `Path is not a symbolic link, changing directory to the specified destination '${chalk.italic(
          dir
        )}'...`
      );
      process.chdir(dir);

      if (!silent)
        InfoMessages.success(`Successfully changed the directory to ${chalk.bold(showDir)}.`);
      else console.log();
    } else {
      Verbose.chkType(dir, "directory");
      Errors.expectedDir(showDir);
      return;
    }
  } catch (err) {
    const showDir = new SettingManager().fullOrBase(dir);

    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("change into", showDir);
    } else if (err.code === "ENOENT") {
      // For some reason, there are rare cases where the checks think the directory exists,
      // but when trying to change into it, it throws an error.
      // This usually happens when using the BubbleOS executable, where a folder called
      // "C:\snapshot" is visible on Windows (through 'ls' in BubbleOS), but when trying to
      // change into it, it throws an error.

      Verbose.custom("Directory does not exist.");
      Errors.doesNotExist("directory", showDir);
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = cd;
