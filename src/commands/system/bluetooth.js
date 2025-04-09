const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const bluetooth = async (...args) => {
  try {
    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const data = await si.bluetoothDevices();

    spinner.stop();
    Verbose.stopSpinner();

    data.forEach((device) => {
      _showKeyValue(
        device,
        new Map([
          ["device", "Device"],
          ["name", "Name"],
          ["macDevice", "MAC Address Device"],
          ["macHost", "MAC Address Host"],
          ["batteryPercent", "Battery"],
          ["manufacturer", "Manufacturer"],
          ["type", "Type"],
          ["connected", "Connected"],
        ]),
        "name"
      );
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = bluetooth;
