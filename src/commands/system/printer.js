const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const printer = async (...args) => {
  try {
    console.log("Values will be beautified in the future, this is for testing! :)\n");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const data = await si.printer();

    spinner.stop();
    Verbose.stopSpinner();

    data.forEach((device) => {
      delete device.id;

      _showKeyValue(
        device,
        new Map([
          ["name", "Name"],
          ["model", "Model"],
          ["uri", "URI"],
          ["uuid", "UUID"],
          ["status", "Status"],
          ["local", "Local"],
          ["default", "Default"],
          ["shared", "Shared"],
        ]),
        "name"
      );
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = printer;
