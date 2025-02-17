const chalk = require("chalk");

const SettingManager = require("./SettingManager");

/**
 * Class to display various messages, either a success, information, warning, or error (not fatal) message.
 *
 * Initialization is not required, so you can call it like `InfoMessages.success()`.
 *
 * The message is the only required argument for all functions.
 */
class InfoMessages {
  constructor() {}

  static success(message) {
    if (new SettingManager().checkSetting("infoMsgPrefix"))
      console.log(chalk.green(`${chalk.white.bgGreen(" SUCCESS: ")} ${message}\n`));
    else console.log(chalk.green(`${message}\n`));
  }

  static info(message) {
    if (new SettingManager().checkSetting("infoMsgPrefix"))
      console.log(chalk.blue(`${chalk.white.bgBlue(" INFO: ")} ${message}\n`));
    else console.log(chalk.blue(`${message}\n`));
  }

  static warning(message) {
    if (new SettingManager().checkSetting("infoMsgPrefix"))
      console.log(chalk.yellow(`${chalk.black.bgYellow(" WARNING: ")} ${message}\n`));
    else console.log(chalk.yellow(`${message}\n`));
  }

  static error(message) {
    if (new SettingManager().checkSetting("infoMsgPrefix"))
      console.log(chalk.red(`${chalk.white.bgRed(" ERROR: ")} ${message}\n`));
    else console.log(chalk.red(`${message}\n`));
  }
}

module.exports = InfoMessages;
