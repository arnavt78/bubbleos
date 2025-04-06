const fs = require("fs");
const chalk = require("chalk");
const { question } = require("readline-sync");

const { GLOBAL_NAME, SHORT_NAME } = require("../variables/constants");

const InfoMessages = require("../classes/InfoMessages");
const ConfigManager = require("../classes/ConfigManager");

/**
 * The name of the file to store the error message in.
 */
const ERROR_INFO_FILENAME = `${SHORT_NAME}_error_info.txt`.toUpperCase();

/**
 * End BubbleOS with a fatal exception with exit code `1`.
 *
 * To give a non-fatal error, use `_nonFatalError`.
 *
 * Usage:
 *
 * ```js
 * try {
 *   throw new Error();
 * } catch (err) {
 *   _fatalError(err);
 * }
 * ```
 *
 * @param {Error} err The error that caused the fatal error.
 * @param {boolean} doFileDump Whether or not to save a file containing error info. Defaults to `true`.
 */
const _fatalError = (err, doFileDump = true) => {
  const errProperties = {
    // For 'Error':
    Code: err?.code,
    Message: err?.message,
    "Stack trace": err?.stack,
    // For 'SystemError':
    Address: err?.address,
    Destination: err?.dest,
    "Error number": err?.errno,
    Information: err?.info,
    Path: err?.path,
    Port: err?.port,
    "System call": err?.syscall,
  };

  // Beep
  process.stdout.write("\u0007");

  console.log(`${chalk.bgRed.bold.underline("!!! FATAL ERROR !!!")}\n`);
  console.log(
    `${chalk.red.bold(
      `A fatal exception has occurred in ${GLOBAL_NAME}. To avoid damage to ${GLOBAL_NAME} and the operating system, ${GLOBAL_NAME} has been aborted with a failure status.
      \nMake sure that your system supports ${GLOBAL_NAME}. If your system is supported, there may be a bug in ${GLOBAL_NAME}.\nIn that case, report the bug on the project's GitHub page (https://github.com/arnavt78/bubbleos/issues/new).`
    )}\n`
  );

  console.log(`${chalk.red.dim.underline("Technical Error Information\n")}`);

  // Show error properties
  for (let error in errProperties) {
    if (typeof errProperties[error] !== "undefined")
      console.log(chalk.red.dim(`${chalk.italic(error)}: ${errProperties[error]}`));
  }

  console.log();

  let saveSuccess = false;
  if (doFileDump) {
    try {
      let errorArr = [];

      // Save error properties in file
      for (let error in errProperties) {
        if (typeof errProperties[error] !== "undefined")
          errorArr.push(`${error}: ${errProperties[error]}`);
      }

      // Starting text for file, including date of crash
      const date = new Date();
      const errorInfoTxt = `${GLOBAL_NAME} encountered a fatal error on ${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${String(date.getDate()).padStart(
        2,
        "0"
      )}/${date.getFullYear()} at ${String(date.getHours())}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}:${String(date.getSeconds()).padStart(
        2,
        "0"
      )}.\nGive the developer this information by going to https://github.com/arnavt78/bubbleos/issues/new (GitHub account required).\n\n${errorArr.join(
        "\n"
      )}\n`;

      fs.writeFileSync(ERROR_INFO_FILENAME, errorInfoTxt);

      InfoMessages.success(
        `Saved file ${chalk.bold(ERROR_INFO_FILENAME)} in ${chalk.bold(process.cwd())}.`
      );

      saveSuccess = true;
    } catch {
      InfoMessages.error(
        `Could not save file ${chalk.bold(ERROR_INFO_FILENAME)} in ${chalk.bold(process.cwd())}.`
      );
    }
  }

  // Save information about BubbleOS crashing
  if (saveSuccess && doFileDump) {
    if (!new ConfigManager().addData({ lastCrashed: true })) {
      InfoMessages.error(
        `An error occurred while trying to save information to the configuration file.`
      );
    }
  }

  question(chalk.red("Press the Enter key to continue . . . "), { hideEchoBack: true, mask: "" });

  console.log(chalk.bold(`\nTerminating ${GLOBAL_NAME} process...\n`));
  process.exit(1);
};

module.exports = _fatalError;
