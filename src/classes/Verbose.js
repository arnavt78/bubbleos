const chalk = require("chalk");

const _detectArgs = require("../functions/detectArgs");

const { GLOBAL_NAME } = require("../variables/constants");

const SettingManager = require("./SettingManager");

/**
 * Class to print verbose messages.
 *
 * The existing verbose pre-made messages are below. To make a custom message, use `Verbose.custom()`.
 *
 * - `initArgs`
 * - `pathAbsolute`
 * - `parseQuotes`
 * - `initChecker`
 * - `initArgs`
 * - `chkEmpty`
 * - `chkExists`
 * - `chkType`
 * - `chkUNC`
 * - `chkEncoding`
 * - `promptUser`
 * - `declinePrompt`
 * - `permError`
 * - `inUseError`
 * - `exitProcess`
 * - `fatalError`
 */
class Verbose {
  constructor() {}

  /**
   * Show a custom verbose message, if the --verbose flag was passed.
   *
   * Also used for other pre-made messages.
   *
   * @param {string} message The message to display.
   */
  static custom(message) {
    const date = new Date();
    const formattedDate = chalk.dim(
      `[${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}:${String(date.getSeconds()).padStart(2, "0")}:${String(date.getMilliseconds()).padStart(
        3,
        "0"
      )}]`
    );

    if (_detectArgs("verbose")) {
      if (new SettingManager().checkSetting("infoMsgPrefix"))
        console.log(
          chalk.yellow(`${formattedDate} ${chalk.bgBlack.bold(" VERBOSE: ")} ${message}`)
        );
      else console.log(chalk.yellow(`${formattedDate} ${message}`));
    }
  }

  /**
   * Verbose message describing conversion of the path to an absolute path.
   *
   * @param {string} path The path to convert.
   */
  static pathAbsolute(path) {
    this.custom(`Converting path '${chalk.italic(path)}' to an absolute path...`);
  }

  /**
   * Verbose message describing parsing of double quotes for arguments with spaces.
   */
  static parseQuotes() {
    this.custom("Parsing double quotes for arguments with spaces...");
  }

  /**
   * Verbose message describing the initializing of the Checks class.
   */
  static initChecker() {
    this.custom("Initializing checker...");
  }

  /**
   * Verbose message describing the initializing of the configuration manager.
   */
  static initConfig() {
    this.custom("Initializing configuration manager...");
  }

  /**
   * Verbose message describing the initializing of the path to show, depending on the setting.
   */
  static initShowPath() {
    this.custom("Setting up type of path (full or basename) to display depending on setting...");
  }

  /**
   * Verbose message describing the initializing of arguments.
   */
  static initArgs() {
    this.custom("Initializing arguments...");
  }

  /**
   * Verbose message describing the fact that required arguments were detected to be empty.
   */
  static chkEmpty() {
    this.custom(`One or more arguments were detected to be empty.`);
  }

  /**
   * Verbose message describing the fact that the path passed does not exist.
   *
   * @param {string} variable The path that does not exist.
   */
  static chkExists(variable) {
    this.custom(`Path '${chalk.italic(variable)}' was detected to not exist.`);
  }

  /**
   * Verbose message describing the fact that the path was the incorrect type.
   *
   * @param {string} variable The path.
   * @param {"file" | "directory"} type The type that was expected (e.g. expected file).
   */
  static chkType(variable, type) {
    this.custom(
      `Path '${chalk.italic(variable)}' was detected to be a ${
        type.toLowerCase() === "file" ? "directory" : "file"
      }; expected ${type}.`
    );
  }

  /**
   * Verbose message describing the fact that the path was detected to be a UNC path.
   */
  static chkUNC() {
    this.custom("Path was detected to be a UNC path, which is not supported by BubbleOS.");
  }

  /**
   * Verbose message describing the fact that the file has invalid encoding.
   */
  static chkEncoding() {
    this.custom("File was detected to have invalid encoding.");
  }

  /**
   * Verbose message describing the yes/no prompt for user confirmation.
   */
  static promptUser() {
    this.custom("Prompting for user confirmation...");
  }

  /**
   * Verbose message describing the user declining the prompt.
   */
  static declinePrompt() {
    this.custom("User did not accept, aborting process...");
  }

  /**
   * Verbose message describing a permission error.
   */
  static permError() {
    this.custom("Encountered a permission error while trying to access path.");
  }

  /**
   * Verbose message describing an 'in use' error.
   */
  static inUseError() {
    this.custom("Encountered an error, due to the path being used by another program.");
  }

  /**
   * Verbose message describing an unknown error.
   */
  static unknownError() {
    this.custom("An unknown error occurred.");
  }

  /**
   * Verbose message describing the exit of BubbleOS.
   *
   * @param {number} code The code BubbleOS was exited with. Must be `0` or `1`, defaults to `0`.
   */
  static exitProcess(code = 0) {
    this.custom(`Exiting ${GLOBAL_NAME} process with status code ${code}...`);
  }

  /**
   * Verbose message describing a fatal unhandled exception.
   */
  static fatalError() {
    this.custom("Unhandled exception, throwing fatal error...");
  }
}

module.exports = Verbose;
