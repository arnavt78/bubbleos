const chalk = require("chalk");

const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const InfoMessages = require("../classes/InfoMessages");
const ConfigManager = require("../classes/ConfigManager");
const Verbose = require("../classes/Verbose");

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
 * @param {number | string} numToDisplay Optional. The number point in history to display by itself. If it is not provided, it will show all commands in history.
 * @param {...string} args Arguments to modify the behavior of `history`.
 */
const history = (numToDisplay, ...args) => {
  try {
    Verbose.initArgs();
    const clear = args.includes("-c") || numToDisplay === "-c";

    const config = new ConfigManager();

    // Clear history if "-c" is passed
    if (clear) {
      Verbose.custom("Clearing history...");
      if (typeof config.getConfig() === "undefined") {
        // TODO fix an issue where resetting history will cause next 'history'
        // command to throw an error when reading config file.
        // If it is not fixable, remove the error message from displaying, and make it
        // automatically reset the configuration file and then function as normal
        // instead of returning.
        InfoMessages.error(
          "Error when reading history from the configuration file. Resetting file..."
        );

        Verbose.custom("Resetting configuration file...");
        config.deleteConfig();
        config.createConfig();

        config.addData({ history: [] });
        return;
      }

      Verbose.custom("Resetting 'history' key...");
      config.addData({ history: [] });
      console.log(chalk.green("Cleared the history.\n"));
      return;
    }

    Verbose.custom("Getting history stored in configuration file...");
    const historyConfig = config.getConfig()?.history;

    // Fetch history from the config file
    if (typeof historyConfig === "undefined") {
      // If I wasn't stupid I would've put this in a function
      // but seriously who can be bothered ¯\_(ツ)_/¯
      InfoMessages.error(
        "Error when reading history from the configuration file. Resetting file..."
      );

      Verbose.custom("Resetting configuration file...");
      config.deleteConfig();
      config.createConfig();
      return;
    }

    if (typeof numToDisplay === "undefined") {
      Verbose.custom("Showing all commands in history...");
      if (historyConfig.length === 0) {
        Verbose.custom("No commands detected in history.");
        console.log(chalk.yellow("No commands in history yet.\n"));
        return;
      }

      // Display all history entries
      for (const [idx, value] of historyConfig.entries()) {
        _formatHist(idx + 1, value);
      }

      console.log();
      return;
    }

    // Validate the input and display specific history point
    if (numToDisplay % 1 !== 0) {
      Verbose.custom("Detected invalid characters passed into history point...");
      Errors.invalidCharacters("history point", "numbers", "letters/symbols", numToDisplay);
      return;
    } else if (typeof historyConfig[numToDisplay - 1] === "undefined") {
      Verbose.custom(
        `Cannot find command at ${numToDisplay} (${historyConfig[numToDisplay - 1]}).`
      );
      console.log(chalk.yellow(`Cannot find the command in history point ${numToDisplay}.\n`));
      return;
    }

    Verbose.custom(`Showing specific history at point ${numToDisplay}...`);
    _formatHist(numToDisplay, historyConfig[numToDisplay - 1]);
    console.log();
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = history;
