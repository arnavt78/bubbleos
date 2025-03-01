const chalk = require("chalk");
const { question } = require("readline-sync");

const _welcomeMsg = require("./init/welcomeMsg");
const _initConfig = require("./init/initConfig");
const _fatalError = require("./fatalError");

const {
  GLOBAL_NAME,
  REQUIRE_CONFIG_RESET,
  BUILD,
  RELEASE_CANDIDATE,
} = require("../variables/constants");

const requiredSettings = require("../data/settings.json");

const ConfigManager = require("../classes/ConfigManager");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

/**
 * Reset the configuration file and then throw a corrupted configuration file error.
 */
const _resetAndError = () => {
  if (!_initConfig()) {
    InfoMessages.error(
      "The configuration file was detected to be corrupted, and has been reset. A restart is required for the changes to fully take effect."
    );
    question(chalk.red("Press the Enter key to continue . . . "), { hideEchoBack: true, mask: "" });

    console.log();
    process.exit(0);
  } else {
    InfoMessages.error(
      "The configuration file was detected to be corrupted, and was attempted to be reset, but an error occurred while attempting to do so."
    );
    question(chalk.red("Press the Enter key to continue . . . "), { hideEchoBack: true, mask: "" });

    console.log();
    process.exit(1);
  }
};

/**
 * Verify the integrity of the configuration file. The checks should be edited alongside
 * the `initConfig` function, as that function contains integral values for BubbleOS to function
 * correctly.
 *
 * @param {boolean} showFirstTimeMsg Whether to show the first time message or not, if the configuration file was deleted.
 */
const _verifyConfig = (showFirstTimeMsg) => {
  try {
    const config = new ConfigManager();
    const configData = config.getConfig();

    if (!config.configChk.doesExist()) {
      if (!_initConfig()) {
        if (showFirstTimeMsg) {
          Verbose.custom("Configuration file was created successfully, showing welcome message...");
          _welcomeMsg();
          return;
        }

        InfoMessages.info(
          "The configuration file was detected to be removed, and was recreated. A restart is required for the changes to fully take effect."
        );
        question(chalk.blue("Press the Enter key to continue . . . "), {
          hideEchoBack: true,
          mask: "",
        });

        console.log();
        process.exit(0);
      } else {
        Verbose.custom("Configuration file was attempted to be created, but an error occurred...");
        _startupError(
          `The ${GLOBAL_NAME} configuration file was attempted to be created, but an error occurred when attempting to do so. ${GLOBAL_NAME} cannot continue without this file.`
        );
      }
    }

    try {
      JSON.parse(config.getRawConfig());
    } catch {
      _resetAndError();
    }

    // Check if the configuration file is outdated.
    //
    // If the build number is greater than the current build number, or the release candidate
    // is greater than the current release candidate, then the configuration file is outdated.
    // Also, if the release candidate is 0 and the build number is greater than the current build number,
    // then the configuration file is outdated, and if the build number is the same but the release
    // candidate went from a positive integer to 0, then the configuration file is outdated.
    const isOutdated =
      typeof configData?.build !== "undefined" &&
      ((BUILD === configData?.build && RELEASE_CANDIDATE < configData?.releaseCandidate) ||
        (RELEASE_CANDIDATE === 0 && BUILD > configData?.build) ||
        (BUILD === configData?.build &&
          configData?.releaseCandidate > 0 &&
          RELEASE_CANDIDATE === 0) ||
        BUILD > configData?.build ||
        (BUILD === configData?.build && RELEASE_CANDIDATE > configData?.releaseCandidate));

    if (isOutdated && REQUIRE_CONFIG_RESET) {
      if (!_initConfig()) {
        InfoMessages.info(
          `The configuration file was detected to be outdated, and has been reset. A restart is required for the changes to fully take effect.`
        );
        question(chalk.blue("Press the Enter key to continue . . . "), {
          hideEchoBack: true,
          mask: "",
        });

        console.log();
        process.exit(0);
      } else {
        InfoMessages.error(
          "The configuration file was detected to be outdated, and was attempted to be reset, but an error occurred while attempting to do so."
        );
        question(chalk.red("Press the Enter key to continue . . . "), {
          hideEchoBack: true,
          mask: "",
        });

        console.log();
        process.exit(1);
      }
    } else if (isOutdated && !REQUIRE_CONFIG_RESET) {
      config.addData({ build: BUILD });
      config.addData({ releaseCandidate: RELEASE_CANDIDATE });
    }

    const settings = configData?.settings;
    if (!settings) _resetAndError();

    for (const [key] of Object.entries(requiredSettings)) {
      if (
        !settings[key] ||
        typeof settings?.[key]?.displayName === "undefined" ||
        typeof settings?.[key]?.current === "undefined" ||
        typeof settings?.[key]?.current?.displayName === "undefined" ||
        typeof settings?.[key]?.current?.value === "undefined"
      ) {
        _resetAndError();
      }
    }

    if (!configData?.history || !configData?.build || !configData?.nextUpdateCheck)
      _resetAndError();
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _verifyConfig;
