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
      delete device.id;
      _showKeyValue(
        device,
        new Map([
          ["name", "Name"],
          ["manufacturer", "Manufacturer"],
          ["revision", "Revision"],
          ["driver", "Driver"],
          ["default", "Default"],
          ["channel", "Channel"],
          ["type", "Type"],
          ["in", "Input"],
          ["out", "Output"],
          ["status", "Status"],
        ]),
        "name"
      );
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = audio;
