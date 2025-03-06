const chalk = require("chalk");

const { GLOBAL_NAME } = require("../variables/constants");

const _promptForYN = require("../functions/promptForYN");
const _fatalError = require("./fatalError");

const Verbose = require("../classes/Verbose");
const SettingManager = require("../classes/SettingManager");

/**
 * Exits the BubbleOS shell gracefully.
 *
 * @param {boolean} showPrompt Whether to show the exit prompt or not. Defaults to `false`.
 * @param {boolean} clearScreen Whether to clear the screen on exit or not. Defaults to `false`.
 */
const _exit = (showPrompt = false, clearScreen = false) => {
  try {
    if (new SettingManager().checkSetting("confirmExit") && showPrompt) {
      Verbose.promptUser();
      if (!_promptForYN(`Are you sure you want to exit ${GLOBAL_NAME}?`)) {
        Verbose.declinePrompt();
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }
    }

    console.log(chalk.bold(`Exiting the ${GLOBAL_NAME} shell...\n`));

    if (clearScreen) {
      process.stdout.write("\x1bc");
      Verbose.custom("Cleared screen.");
    }

    Verbose.exitProcess();
    process.exit(0);
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _exit;
