const chalk = require("chalk");
const { question } = require("readline-sync");

const {
  GLOBAL_NAME,
  AUTHOR,
  VERSION,
  BUILD,
  IN_BETA,
  TIMEBOMB_ACTIVATED,
  EXPIRY_DATE,
} = require("../../variables/constants");

const _initConfig = require("./initConfig");

const Verbose = require("../../classes/Verbose");
const SettingManager = require("../../classes/SettingManager");
const ConfigManager = require("../../classes/ConfigManager");
const InfoMessages = require("../../classes/InfoMessages");

const config = new ConfigManager();
const showVersion = new SettingManager().showVersion();

if (typeof config.getConfig() === "undefined") {
  if (!_initConfig()) {
    InfoMessages.info(
      `The ${GLOBAL_NAME} configuration file was either corrupted or deleted, and a new one has been created. A restart is required for the changes to take effect.`
    );
    question(chalk.blue("Press the Enter key to continue . . . "), {
      hideEchoBack: true,
      mask: "",
    });

    console.log();
    process.exit(0);
  } else {
    InfoMessages.error(
      `The ${GLOBAL_NAME} configuration file was either corrupted or deleted, and a new one was attempted to be created, but an error occurred when attempting to do so.\nTry manually deleting the configuration file, located at ${chalk.bold(
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

const configData = config.getConfig();

if (showVersion) {
  console.log(`${chalk.bold(`${GLOBAL_NAME}, v${VERSION} (build ${BUILD})`)}`);
}

// Only display if this is the first time BubbleOS is running
if (!configData?.firstIntro) {
  console.log(`Made by ${AUTHOR}!`);
}

if (showVersion || !configData?.firstIntro) console.log();

Verbose.custom(`Checking if ${GLOBAL_NAME} is in beta...`);
if (IN_BETA) {
  Verbose.custom("Checking if the timebomb is activated...");
  if (TIMEBOMB_ACTIVATED) {
    // Show a timebomb warning message
    Verbose.custom("Timebomb is activated and is in beta, show relevant message...");
    console.log(
      chalk.dim(
        `${chalk.bold(
          "WARNING!"
        )} This beta software has a timebomb of +90 days (since compile date).\nIt will expire on ${
          EXPIRY_DATE.getMonth() + 1
        }/${EXPIRY_DATE.getDate()}/${EXPIRY_DATE.getFullYear()}.\n`
      )
    );
  } else {
    // Show a beta warning message
    Verbose.custom("Timebomb is not activated but software is in beta, show relevant message...");
    console.log(
      chalk.dim(
        `${chalk.bold(
          "WARNING!"
        )} This software is in beta and subject to changes.\nThis software is extremely unstable and should not be used for day-to-day use.\n`
      )
    );
  }
}

// Show information about commands
if (!configData?.firstIntro) {
  console.log(`For a list on some available commands, type '${chalk.italic("help")}'.`);
  console.log(`For more information about a command, type '${chalk.italic("help <command>")}'.\n`);

  console.log(`To exit the ${GLOBAL_NAME} shell, type '${chalk.italic("exit")}'.\n`);
}

if (configData?.lastCrashed) {
  InfoMessages.warning(
    `${GLOBAL_NAME} crashed the last time it was run. For more information, find the error information file in the directory you ran ${GLOBAL_NAME} in.`
  );

  config.addData({ lastCrashed: false });
}

// Make sure long intro cannot display again on the system
config.addData({ firstIntro: true });
