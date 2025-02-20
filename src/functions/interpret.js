const chalk = require("chalk");

const { COMMANDS, ALIASES } = require("../variables/commands");

const _fatalError = require("./fatalError");
const _verifyConfig = require("./verifyConfig");
const { _addToHist } = require("../functions/addToHist");

const Errors = require("../classes/Errors");
const Verbose = require("../classes/Verbose");
const InfoMessages = require("../classes/InfoMessages");
const SettingManager = require("../classes/SettingManager");

/**
 * Split the commands passed into BubbleOS, and then remove the actual command name (the first word)
 *
 * @param {string} command The entire command that the user entered.
 */
const _multiParam = (command) => {
  const params = command.split(" ");
  params.shift();
  return params;
};

const _getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value);

/**
 * Interpret all available BubbleOS commands.
 *
 * @param {string} command The command that was requested to be interpreted by the user.
 * @param {boolean} storeInHistory Whether or not to store the command in history. Defaults to true.
 */
const _intCmds = async (command, storeInHistory = true) => {
  try {
    Verbose.custom("Checking if command entered is empty...");
    const isEmpty = command.length === 0;
    Verbose.custom("Checking entered command...");
    let enteredCmd = command.split(" ")[0];

    if (!new SettingManager().checkSetting("caseSensitiveCmd"))
      enteredCmd = enteredCmd.toLowerCase();

    // The command is currently unrecognized
    let recognized = false;

    for (let [key, value] of Object.entries(COMMANDS)) {
      if (enteredCmd === key) {
        Verbose.custom("Command has been recognized, executing command...");
        recognized = true;

        if (key === "bub") {
          // If the command is 'bub', it requires the '_intCmds' function, so call/pass it separately
          await value(_intCmds, ..._multiParam(command));
        } else {
          await value(..._multiParam(command));
        }
      }
    }

    // If the command is not recognized and isn't empty
    if (!recognized && !isEmpty) {
      Verbose.custom(
        `Command '${enteredCmd}' was detected to be unrecognized, show respective error...`
      );
      Errors.unrecognizedCommand(enteredCmd);

      // Alias detection
      for (const alias of Object.values(ALIASES)) {
        for (const cmd of alias) {
          if (cmd === enteredCmd) {
            Verbose.custom("Alias detected for entered command, show tip to user...");
            InfoMessages.info(
              `There is no command called ${chalk.italic(enteredCmd)}. Did you mean ${chalk.bold(
                _getKeyByValue(ALIASES, alias)
              )}?`
            );

            break;
          }
        }
      }
    }

    Verbose.custom("Verifying configuration file integrity...");
    _verifyConfig(false);

    // TODO I don't like 'history -c' being hardcoded for some reason
    if (!isEmpty && storeInHistory && command !== "history -c") {
      Verbose.custom("Adding command to history...");
      _addToHist(command);
    }
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = _intCmds;
