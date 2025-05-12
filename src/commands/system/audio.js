const chalk = require("chalk");
const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const audio = async (...args) => {
  try {
    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const data = await si.audio();

    spinner.stop();
    Verbose.stopSpinner();

    data.forEach((device) => {
      console.log(
        chalk.bold.red(`${device.name}${chalk.reset.red(device.type ? ` (${device.type})` : "")}`)
      );
      console.log(chalk.italic(`By ${device.manufacturer}`));

      console.log();
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = audio;
