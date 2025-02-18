const chalk = require("chalk");
const { select } = require("@inquirer/prompts");

const { GLOBAL_NAME } = require("../variables/constants");

const settings = require("../data/settings.json");

const _fatalError = require("../functions/fatalError");

const exit = require("./exit");

const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const ConfigManager = require("../classes/ConfigManager");

/**
 * Change the settings of BubbleOS.
 *
 * All settings are defined in `./src/data/settings.json`. New settings should
 * be changed there and existing settings modified.
 *
 * If existing settings are needed to be modified, set `REQUIRE_CONFIG_RESET` in
 * `constants.js` to true. Settings are stored in the BubbleOS configuration file.
 *
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const setmgr = async (...args) => {
  try {
    process.stdout.write("\x1bc");
    Verbose.custom("Initializing setting environment...");
    console.log(chalk.bold.underline(`Change ${GLOBAL_NAME} Settings\n`));

    Verbose.initConfig();
    const config = new ConfigManager();
    let errorEncountered = false;

    for (const key of Object.keys(settings)) {
      Verbose.custom("Getting setting information...");
      const setting = settings[key];
      const displayName = setting.displayName.replaceAll("{GLOBAL_NAME}", GLOBAL_NAME);
      const description = setting.description.replaceAll("{GLOBAL_NAME}", GLOBAL_NAME);

      // Get the latest config each loop iteration
      Verbose.custom("Obtaining current setting value...");
      const currentConfig = config.getConfig() || { settings: {} };

      // Get current value, defaulting to the setting's default
      const current = currentConfig.settings?.[key]?.current?.value ?? setting.default.value;

      console.log(chalk.bold.blue(`=== ${displayName} ===`));
      console.log(chalk.gray(description));

      console.log();

      console.log(chalk.green(`Default: ${setting.default.displayName}`));
      console.log(
        chalk.yellow(`Current: ${currentConfig.settings?.[key]?.current?.displayName ?? "N/A"}`)
      );
      console.log();

      // Ask user for new value
      Verbose.custom("Prompting user for new setting value...");
      const newValue = await select({
        message: `Change the setting for "${displayName}":`,
        choices: setting.options.map((opt) => ({
          name: opt.displayName,
          value: opt.value,
        })),
        default: current,
      });

      if (newValue !== current) {
        Verbose.custom("Updating setting...");
        const updatedConfig = {
          settings: {
            ...currentConfig.settings, // Preserve all previous settings
            [key]: {
              displayName,
              current: {
                displayName: setting.options.find((opt) => opt.value === newValue).displayName,
                value: newValue,
              },
            },
          },
        };

        Verbose.custom("Saving setting in configuration file...");
        const cfgSuccess = config.addData(updatedConfig); // Save updated settings
        errorEncountered = errorEncountered ? true : !cfgSuccess;

        Object.assign(currentConfig, updatedConfig);
      }

      process.stdout.write("\x1bc");
    }

    Verbose.custom("Exiting setting environment...");
    if (errorEncountered) InfoMessages.error("An error occurred while saving the settings.");
    else InfoMessages.success("Settings saved successfully.");
  } catch (err) {
    if (err.name === "ExitPromptError") {
      // If the user presses Ctrl+C, exit BubbleOS gracefully
      Verbose.custom("Detected Ctrl+C, exiting...");
      exit();
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = setmgr;
