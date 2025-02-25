const chalk = require("chalk");
const { question } = require("readline-sync");

const _detectArgs = require("../detectArgs");
const _initConfig = require("./initConfig");

const ConfigManager = require("../../classes/ConfigManager");
const InfoMessages = require("../../classes/InfoMessages");
const Verbose = require("../../classes/Verbose");

const {
  GLOBAL_NAME,
  EXPIRY_DATE,
  BUILD,
  REQUIRE_CONFIG_RESET,
} = require("../../variables/constants");

Verbose.initConfig();
const config = new ConfigManager();

// Introduction
Verbose.custom("Displaying intro...");
require("./intro");

// Timebomb disabler
Verbose.custom("Completing timebomb disabler check...");
if (
  _detectArgs("timebomb") &&
  !_detectArgs("warnings") &&
  EXPIRY_DATE.getTime() < new Date().getTime()
)
  InfoMessages.warning(
    `The timebomb has been disabled. The timebomb is a security feature to prevent you from using outdated software. Please upgrade to a new version of ${GLOBAL_NAME} as soon as possible.`
  );

// Fatal error file dump
Verbose.custom("Completing fatal error file dump check...");
if (_detectArgs("dump") && !_detectArgs("warnings"))
  InfoMessages.warning("The fatal error file dump feature has been disabled.");

// Configuration file reset/creation
if (_detectArgs("reset") || typeof config.getConfig() === "undefined") {
  Verbose.custom("Resetting/creating configuration file...");
  if (!_initConfig()) {
    InfoMessages.info(
      "The configuration file was successfully reset. A restart is required for the changes to fully take effect."
    );
    question(chalk.blue("Press the Enter key to continue . . . "), {
      hideEchoBack: true,
      mask: "",
    });

    console.log();
    process.exit(0);
  } else {
    InfoMessages.error("An error occurred when attempting to reset the configuration file.");
  }
}

if (
  (typeof config.getConfig().build === "undefined" || config.getConfig().build < BUILD) &&
  REQUIRE_CONFIG_RESET
) {
  if (!_initConfig()) {
    InfoMessages.info(
      `An older version of the ${GLOBAL_NAME} configuration file was detected, and has been reset to the newest version. A restart is required for the changes to fully take effect.`
    );
    question(chalk.blue("Press the Enter key to continue . . . "), {
      hideEchoBack: true,
      mask: "",
    });

    console.log();
    process.exit(0);
  } else {
    InfoMessages.error(
      `An older version of the ${GLOBAL_NAME} configuration file was detected, and was attempted to be reset to the newest version, but an error occurred when attempting to do so.\nTry manually deleting the configuration file, located at ${chalk.bold(
        config.configPath
      )}.`
    );
    question(chalk.red("Press the Enter key to continue . . . "), {
      hideEchoBack: true,
      mask: "",
    });

    console.log();
    process.exit(0);
  }
}
