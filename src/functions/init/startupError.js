const chalk = require("chalk");
const { question } = require("readline-sync");

const { GLOBAL_NAME } = require("../../variables/constants");

const _fatalError = require("../fatalError");

const InfoMessages = require("../../classes/InfoMessages");

/**
 * Causes BubbleOS to either exit or crash due to an error on startup.
 *
 * @param {string} message The message to display, usually the reason for the error.
 * @param {boolean} doFatalError Whether or not BubbleOS should crash. Defaults to `false`.
 * @param {string} fatalErrorMessage The error message to display in the fatal error. Defaults to `A startup error occurred`.
 */
const startupError = (
  message,
  doFatalError = false,
  fatalErrorMessage = "A startup error occurred."
) => {
  try {
    InfoMessages.error(`${message}${doFatalError ? `\n${GLOBAL_NAME} will now crash.` : ""}`);
    question(chalk.red("Press the Enter key to continue . . . "), { hideEchoBack: true, mask: "" });

    console.log();

    if (doFatalError) {
      try {
        throw new Error(fatalErrorMessage);
      } catch (err) {
        // Reason for try/catch inside try/catch is for the prevention of fatal error file dump
        _fatalError(err, false);
      }
    } else {
      process.exit(1);
    }
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = startupError;
