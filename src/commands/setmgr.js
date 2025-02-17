const chalk = require("chalk");
const { select } = require("@inquirer/prompts");

const { GLOBAL_NAME } = require("../variables/constants");

const settings = require("../data/settings.json");

const _fatalError = require("../functions/fatalError");

const exit = require("./exit");

const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const ConfigManager = require("../classes/ConfigManager");

const setman = async (...args) => {
  try {
    process.stdout.write("\x1bc");
    console.log(chalk.bold.underline(`Change ${GLOBAL_NAME} Settings\n`));

    const config = new ConfigManager();
    const currentConfig = config.getConfig() || { settings: {} };

    let errorEncountered = false;

    for (const key of Object.keys(settings)) {
      const setting = settings[key];

      // Get the latest config each loop iteration
      const currentConfig = config.getConfig() || { settings: {} };

      // Get current value, defaulting to the setting's default
      const current = currentConfig.settings?.[key]?.current?.value ?? setting.default.value;

      console.log(chalk.bold.blue(`=== ${setting.displayName} ===`));
      console.log(chalk.gray(setting.description.replaceAll("{GLOBAL_NAME}", GLOBAL_NAME)));

      console.log();

      console.log(chalk.green(`Default: ${setting.default.displayName}`));
      console.log(
        chalk.yellow(`Current: ${currentConfig.settings?.[key]?.current?.displayName ?? "N/A"}`)
      );
      console.log();

      // Ask user for new value
      const newValue = await select({
        message: `Change the setting for "${setting.displayName}":`,
        choices: setting.options.map((opt) => ({
          name: opt.displayName,
          value: opt.value,
        })),
        default: current,
      });

      if (newValue !== current) {
        const updatedConfig = {
          settings: {
            ...currentConfig.settings, // Preserve all previous settings
            [key]: {
              displayName: setting.displayName,
              current: {
                displayName: setting.options.find((opt) => opt.value === newValue).displayName,
                value: newValue,
              },
            },
          },
        };

        const cfgSuccess = config.addData(updatedConfig); // Save updated settings
        errorEncountered = errorEncountered ? true : !cfgSuccess;

        Object.assign(currentConfig, updatedConfig);
      }

      process.stdout.write("\x1bc");
    }

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

module.exports = setman;
