const fs = require("fs");
const chalk = require("chalk");
const path = require("path");

const _nonFatalError = require("../functions/nonFatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");

/**
 * Interpret a BubbleOS file. This function should only be
 * used as a private function to be called inside of `bub()`.
 *
 * The `intCmds()` function **must** be passed at the start.
 * This is because BubbleOS cannot read the function correctly
 * if it imported instead of passed in (it will be an empty
 * object - `{}` - instead of a function).
 *
 * @param {Function} intCmds The `intCmds` function that needs to be passed as BubbleOS cannot read it properly (as explained above).
 * @param {string} file The path the points to the `.bub` file. It should be a `.bub` file, but others are accepted, as there is no such check for this in the function.
 * @param {{ displayCommand: boolean, allowExit: boolean }} options Optional. Defines options that can modify the behavior of this function. The available keys are listed above.
 */
const _interpretFile = async (
  intCmds,
  file,
  options = { displayCommand: false, allowExit: false }
) => {
  // Separate the file into lines to allow executing each command line-by-line
  Verbose.custom("Reading file and separating into lines...");
  const lines = fs.readFileSync(file, { encoding: "utf-8", flag: "r" }).split("\n");

  // Command that causes infinite loop
  // TODO make it so that if the user enters full path,
  // it will also be detected as invalid
  Verbose.custom("Creating invalid 'bub' command to avoid an infinite loop...");
  const invalidBubCommand = `bub ${path.basename(file)}`;

  // Loop through all lines
  for (let i = 0; i < lines.length; i++) {
    Verbose.custom("Trimming current line...");
    const line = lines[i]?.trim();

    if (line.startsWith("#") || line === "") {
      // Comment or empty line
      Verbose.custom(`Line '${line}' was detected to either be empty or a comment, skipping...`);
      continue;
    } else if (line === invalidBubCommand) {
      // Prevents infinite loop by .bub file executing itself
      if (options.displayCommand) {
        Verbose.custom("Displaying currently executing command...");
        console.log(chalk.underline.bold.red(line));
      }

      Verbose.custom(`Line '${line}' was detected to be an invalid 'bub' command, skipping...`);
      InfoMessages.warning(
        "Infinite loop detected due to executing the same '.bub' file, skipping..."
      );
      continue;
    } else if (line === "exit" && !options.allowExit) {
      // Prevents .bub command from exiting BubbleOS
      // if --allow-exit was not passed
      if (options.displayCommand) {
        Verbose.custom("Displaying currently executing command...");
        console.log(chalk.underline.bold.red(line));
      }

      Verbose.custom(`Line '${line}' was detected to be the 'exit' command, skipping...`);
      InfoMessages.info("Running the 'exit' command from a '.bub' file is currently disabled.");
      continue;
    }

    if (options.displayCommand) {
      // Displays command if requested
      Verbose.custom("Displaying currently executing command...");
      console.log(chalk.underline.bold.red(line));
    }

    // Interprets command, without adding to history
    Verbose.custom("Interpreting command...");
    await intCmds(line, false);
  }
};

/**
 * The `bub` command, used to execute `.bub` files.
 *
 * The `intCmds()` function **must** be passed at the start.
 * This is because BubbleOS cannot read the function correctly
 * if it imported instead of passed in (it will be an empty
 * object - `{}` - instead of a function).
 *
 * @param {Function} intCmds The `intCmds()` function.
 * @param {string} file The path to the BubbleOS file that is going to be executed.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const bub = async (intCmds, file, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute(file);
    Verbose.parseQuotes();
    file = PathUtil.all([file, ...args]);

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    Verbose.initArgs();
    const displayCommand = args.includes("-d");
    const allowExit = args.includes("--allow-exit");

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "bub test.bub");
      return;
    }

    if (!fileChk.doesExist()) {
      Verbose.chkExists(file);
      Errors.doesNotExist("file", showFile);
      return;
    } else if (fileChk.validateType()) {
      Verbose.chkType(file, "file");
      Errors.expectedFile(showFile);
      return;
    } else if (fileChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    } else if (!fileChk.validEncoding()) {
      // To avoid lag with large files with non-plain text encoding
      Verbose.chkEncoding();
      Errors.invalidEncoding("plain text");
      return;
    }

    // Technically the file does not need to end in .bub to work,
    // this is just for fun :P
    // It does need to be plain text though, which is already checked before
    if (!file.endsWith(".bub")) {
      Verbose.custom(`File '${file}' was detected to not end in '.bub'.`);
      InfoMessages.error(
        `The file must end with '.bub'. Received: '${chalk.bold(
          path.basename(showFile)
        )}'. Process aborted.`
      );
      return;
    }

    const beforeCwd = process.cwd();

    // Interprets each line and uses intCmds() function
    Verbose.custom("Interpreting file...");
    await _interpretFile(intCmds, file, { displayCommand, allowExit });

    Verbose.custom("Changing current working directory to path before file was executed...");
    process.chdir(PathUtil.caseSensitive(beforeCwd));
  } catch (err) {
    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("read the file", showFile);
    } else if (err.code === "EBUSY") {
      Verbose.inUseError();
      Errors.inUse("file", showFile);
    } else if (err.code === "ENXIO") {
      Verbose.noDeviceError();
      Errors.noDevice(showFile);
    } else if (err.code === "UNKNOWN") {
      Verbose.unknownError();
      Errors.unknown();
    } else {
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = bub;
