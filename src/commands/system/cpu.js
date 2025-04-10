const chalk = require("chalk");
const si = require("systeminformation");
const ora = require("ora");

const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const cpu = async (...args) => {
  try {
    const advanced = args.includes("-a");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const cpuData = await si.cpu();
    const cpuTempData = await si.cpuTemperature();

    spinner.stop();
    Verbose.stopSpinner();

    Verbose.custom("Displaying CPU information...");

    console.log(
      chalk.bold(
        `${cpuData.manufacturer} ${cpuData.brand} @ ${cpuData.speed.toFixed(2)}GHz x ${
          cpuData.cores
        }`
      )
    );

    if (advanced) {
      console.log(
        `${chalk.dim("Min Speed:")} ${cpuData.speedMin.toFixed(2)}GHz\n${chalk.dim(
          "Max Speed:"
        )} ${cpuData.speedMax.toFixed(2)}GHz`
      );
    }

    if (advanced) {
      console.log(
        `\n${chalk.dim("Vendor:")} ${cpuData.vendor}\n${chalk.dim("Family:")} ${
          cpuData.family
        }\n${chalk.dim("Model:")} ${cpuData.model}\n${chalk.dim("Stepping:")} ${cpuData.stepping}\n`
      );
    }

    console.log(
      `${chalk.bold(cpuData.cores)} cores and ${chalk.bold(
        cpuData.physicalCores
      )} physical cores, with ${chalk.bold(cpuData.processors)} processor.`
    );

    console.log(
      cpuData.virtualization
        ? chalk.green("Supports virtualization.")
        : chalk.red("Does not support virtualization.")
    );

    console.log();

    if (advanced) {
      console.log(`${chalk.dim("Flags:")} ${cpuData.flags}`);
    }

    if (cpuTempData.main) {
      let temperatureMessage = `CPU Temperature: ${cpuTempData.main}°C`;

      if (cpuTempData.main < 50) {
        console.log(chalk.green(temperatureMessage));
      } else if (cpuTempData.main >= 50 && cpuTempData.main < 75) {
        console.log(chalk.yellow(temperatureMessage));
      } else {
        console.log(chalk.red(temperatureMessage));
      }
    }
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = cpu;
