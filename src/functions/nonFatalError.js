const chalk = require("chalk");

const { GLOBAL_NAME } = require("../variables/constants");

const _promptForYN = require("./promptForYN");
const _fatalError = require("./fatalError");

/**
 * Give an error due to an uncaught exception, but **does not crash BubbleOS**.
 *
 * To crash BubbleOS, use `_fatalError`.
 *
 * Usage:
 *
 * ```js
 * try {
 *   throw new Error();
 * } catch (err) {
 *   _nonFatalError(err);
 * }
 * ```
 *
 * @param {Error} err The error that caused the non-fatal error.
 */
const _nonFatalError = (err) => {
  try {
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

    console.log(`${chalk.bgHex("#FFA500").bold.black.underline("=== NON-FATAL ERROR ===")}\n`);

    console.log(
      `${chalk.hex("#FFA500").bold(
        `A non-fatal exception has occurred in ${GLOBAL_NAME}. ${GLOBAL_NAME} can continue to run, however, it should be used with caution.\nThe process/command that was being run has been terminated.
        \nMake sure that your system supports ${GLOBAL_NAME}. If your system is supported, there may be a bug in ${GLOBAL_NAME}.\nIn that case, report the bug on the project's GitHub page (https://github.com/arnavt78/bubbleos/issues/new).`
      )}\n`
    );

    console.log(`${chalk.hex("#FFA500").dim.underline("Technical Error Information\n")}`);

    for (let error in errProperties) {
      if (typeof errProperties[error] !== "undefined")
        console.log(chalk.hex("#FFA500").dim(`${chalk.italic(error)}: ${errProperties[error]}`));
    }

    console.log();

    if (!_promptForYN(`Would you like to continue using ${GLOBAL_NAME}?`)) {
      console.log(chalk.bold(`\nTerminating ${GLOBAL_NAME} process...\n`));
      process.exit(1);
    }

    console.log(chalk.bold(`\nContinuing ${GLOBAL_NAME} process...\n`));
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _nonFatalError;
