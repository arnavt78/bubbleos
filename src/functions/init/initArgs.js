const _detectArgs = require("../detectArgs");
const _initConfig = require("./initConfig");

const ConfigManager = require("../../classes/ConfigManager");
const InfoMessages = require("../../classes/InfoMessages");
const Verbose = require("../../classes/Verbose");

const { GLOBAL_NAME, EXPIRY_DATE } = require("../../variables/constants");

Verbose.custom("Creating configuration manager...");
const config = new ConfigManager();

// Introduction
Verbose.custom("Displaying intro...");
if (!_detectArgs("intro")) require("./intro");

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
  _initConfig();
}
