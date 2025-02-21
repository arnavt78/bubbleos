const chalk = require("chalk");

const { GLOBAL_NAME } = require("../variables/constants");

const _promptForYN = require("../functions/promptForYN");

const Verbose = require("../classes/Verbose");
const SettingManager = require("../classes/SettingManager");

const _exit = (showPrompt = false, clearScreen = false) => {
  if (new SettingManager().checkSetting("confirmExit") && showPrompt) {
    Verbose.promptUser();
    if (!_promptForYN(`Are you sure you want to exit ${GLOBAL_NAME}?`)) {
      Verbose.declinePrompt();
      console.log(chalk.yellow("Process aborted.\n"));
      return;
    }
  }

  console.log(`Exiting the ${GLOBAL_NAME} shell...\n`);

  if (clearScreen) {
    process.stdout.write("\x1bc");
    Verbose.custom("Cleared screen.");
  }

  Verbose.exitProcess();
  process.exit(0);
};

module.exports = _exit;
