const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const usb = async (...args) => {
  try {
    console.log("Values will be beautified in the future, this is for testing! :)\n");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const data = await si.usb();

    spinner.stop();
    Verbose.stopSpinner();

    data.forEach((device, idx) => {
      _showKeyValue(
        device,
        new Map([
          ["bus", "USB Bus"],
          ["deviceId", "Device ID"],
          ["id", "ID"],
          ["name", "Name"],
          ["type", "Type"],
          ["removable", "Removable"],
          ["vendor", "Vendor"],
          ["manufacturer", "Manufacturer"],
          ["maxPower", "Max Power"],
          ["serialNumber", "Serial Number"],
        ]),
        "name" || `USB Device ${idx + 1}`
      );
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = usb;
