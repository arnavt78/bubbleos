const chalk = require("chalk");
const yn = require("yn");
const { question } = require("readline-sync");

const _fatalError = require("./fatalError");

/**
 * Prompt the user for a yes/no prompt message.
 *
 * Prompts the user for a confirmation. By default,
 * if the user enters any character other than _'y'_,
 * it will automatically decline and return `false`.
 * Otherwise, it will accept and return `true`.
 *
 * @param {string} message The message to display to the user in the yes/no prompt.
 * @returns `true` if the user accepts, `false` if the user declines.
 */
const _promptForYN = (message) => {
  try {
    return yn(
      question(`${message} [${chalk.green("y")}/${chalk.red.bold("N")}] `, { guide: false }),
      {
        lenient: true,
      }
    );
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _promptForYN;
