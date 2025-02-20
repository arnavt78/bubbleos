const chalk = require("chalk");

const {
  GLOBAL_NAME,
  AUTHOR,
  VERSION,
  BUILD,
  IN_BETA,
  TIMEBOMB_ACTIVATED,
  EXPIRY_DATE,
} = require("../../variables/constants");

const _verifyConfig = require("../verifyConfig");

const Verbose = require("../../classes/Verbose");
const SettingManager = require("../../classes/SettingManager");
const ConfigManager = require("../../classes/ConfigManager");
const InfoMessages = require("../../classes/InfoMessages");

const config = new ConfigManager();

Verbose.custom("Verifying integrity of configuration file...");
_verifyConfig(true);

const showVersion = new SettingManager().showVersion();
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
        )} This beta software has a timebomb of +90 days (since compile date).\nIt will expire on ${String(
          EXPIRY_DATE.getMonth() + 1
        ).padStart(2, "0")}/${String(EXPIRY_DATE.getDate()).padStart(
          2,
          "0"
        )}/${EXPIRY_DATE.getFullYear()}.\n`
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
