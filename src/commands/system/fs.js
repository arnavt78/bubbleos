const chalk = require("chalk");
const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _convertSize = require("../../functions/convertSize");
const _percentBar = require("../../functions/percentBar");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const fs = async (...args) => {
  try {
    const advanced = args.includes("-a");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const fsData = await si.fsSize();

    spinner.stop();
    Verbose.stopSpinner();

    fsData.forEach((value) => {
      value.size = `${Math.floor(_convertSize(value.size, 1).size)} ${
        _convertSize(value.size, 1).unit
      }`;
      value.used = `${Math.floor(_convertSize(value.used, 1).size)} ${
        _convertSize(value.used, 1).unit
      }`;
      value.available = `${Math.floor(_convertSize(value.available, 1).size)} ${
        _convertSize(value.available, 1).unit
      }`;

      console.log(`Partition ${chalk.bold(value.fs)} (${value.type})`);
      console.log(chalk.dim(`${value.used} used out of ${value.size} (${value.available} free)`));

      console.log(
        `${_percentBar(parseFloat(value.use), "blue")} ${parseFloat(value.use).toFixed(1)}% used`
      );
      if (advanced) console.log(!value.rw ? "Read-Only" : "Readable/Writeable");
      console.log();
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = fs;
