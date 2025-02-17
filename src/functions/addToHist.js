const _initConfig = require("./init/initConfig");

const InfoMessages = require("../classes/InfoMessages");
const ConfigManager = require("../classes/ConfigManager");
const Verbose = require("../classes/Verbose");

/**
 * The number of history commands to store before deleting the oldest ones.
 */
const NUMBER_TO_STORE = 50;

/**
 * Add a command to the history to be later
 * shown in the BubbleOS command `history`.
 *
 * The history is stored in the BubbleOS configuration file,
 * meaning that history persists through sessions.
 *
 * @param {string} command The command that the user entered that should be stored in the history.
 * @param {boolean} addToConfig Whether or not to add the command to the BubbleOS configuration. Defaults to `true`.
 */
const _addToHist = (command, addToConfig = true) => {
  if (!addToConfig) return;

  const config = new ConfigManager();

  // Fetch the history from the config
  Verbose.custom("Checking if configuration exists...");
  if (typeof config.getConfig() === "undefined") {
    InfoMessages.error(
      "Error when saving command to history in the configuration file. Resetting file..."
    );

    Verbose.custom("Resetting configuration file...");
    _initConfig();
    return;
  }

  Verbose.custom("Getting history stored in configuration file...");
  const historyConfig = config.getConfig().history ?? [];

  // If the number of stored commands exceeds the limit, remove the oldest entry
  Verbose.custom(
    `Checking if number of entries stored is greater than ${NUMBER_TO_STORE} entries, and deleting oldest if so...`
  );
  if (historyConfig.length + 1 > NUMBER_TO_STORE) historyConfig.shift();

  // Add the latest command to the history
  Verbose.custom("Adding latest command to history...");
  historyConfig.push(command);

  Verbose.custom("Writing data to configuration file...");
  config.addData({ history: historyConfig });
};

module.exports = { _addToHist, NUMBER_TO_STORE };
