const chalk = require("chalk");

const { NUMBER_TO_STORE } = require("../../functions/addToHist");

const _nonFatalError = require("../../functions/nonFatalError");

const Errors = require("../../classes/Errors");
const InfoMessages = require("../../classes/InfoMessages");
const ConfigManager = require("../../classes/ConfigManager");
const Verbose = require("../../classes/Verbose");

/**
 * Formats history index and command, and logs it.
 *
 * @param {number | string} index The place where the history is stored.
 * @param {string} histCmd The command stored at the point of history.
 */
const _formatHist = (index, histCmd) => {
  console.log(`  ${index}: ${chalk.bold.yellow(histCmd)}`);
};

/**
 * The history CLI command for the BubbleOS shell.
 *
 * This function gets all commands from the `history`
 * array. All commands are added in the history by
 * the `_addToHist()` function.
 *
 * The `-c` argument clears the history and the history
 * stored in the configuration file.
 *
 * @param {number | string} amount Optional. Show the last amount of commands entered, instead of all commands.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const history = (amount, ...args) => {
  try {
    Verbose.initArgs();
    const clear = args.includes("-c") || amount === "-c";

    Verbose.initConfig();
    const config = new ConfigManager();

    // Clear history if "-c" is passed
    if (clear) {
      Verbose.custom("Clearing history...");
      if (typeof config.getConfig() === "undefined") {
        InfoMessages.error("Error when reading history from the configuration file.");
        return;
      }

      Verbose.custom("Resetting 'history' key...");
      config.addData({ history: [] });

      InfoMessages.success("Successfully cleared the history.");
      return;
    }

    Verbose.custom("Getting history stored in configuration file...");
    const historyConfig = config.getConfig()?.history;

    // Fetch history from the config file
    if (typeof historyConfig === "undefined") {
      InfoMessages.error("Error when reading history from the configuration file.");
      return;
    }

    if (historyConfig.length === 0) {
      Verbose.custom("No commands detected in history.");
      console.log(chalk.yellow("No commands in history yet.\n"));
      return;
    }

    if (typeof amount === "undefined") {
      Verbose.custom("Showing all commands in history...");

      // Display all history entries
      for (const [idx, value] of historyConfig.entries()) {
        _formatHist(idx + 1, value);
      }

      console.log();
      return;
    }

    // Validate the input and display specific history point
    if (amount % 1 !== 0) {
      Verbose.custom("Detected invalid characters passed into history point...");
      Errors.invalidCharacters("history point", "numbers", "letters/symbols", amount);
      return;
    }

    for (let i = historyConfig.length - amount + 1; i < historyConfig.length + 1; i++) {
      Verbose.custom(`Attempting to display command at history point ${i}...`);
      if (i - 1 < 0 || i - 1 > NUMBER_TO_STORE) {
        Verbose.custom(
          "Number detected to be larger or smaller than expected; displaying all commands..."
        );
        for (const [idx, value] of historyConfig.entries()) {
          _formatHist(idx + 1, value);
        }
        break;
      }

      _formatHist(i, historyConfig[i - 1]);
    }

    console.log();
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = history;
