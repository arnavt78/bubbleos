const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const battery = async (...args) => {
  try {
    const spinner = ora({ text: "Please wait..." }).start();

    const batteryData = await si.battery();

    if (!batteryData.hasBattery) {
      delete batteryData.cycleCount;
      delete batteryData.isCharging;
      delete batteryData.designedCapacity;
      delete batteryData.maxCapacity;
      delete batteryData.currentCapacity;
      delete batteryData.capacityUnit;
      delete batteryData.voltage;
      delete batteryData.percent;
    }

    spinner.stop();
    Verbose.stopSpinner();

    Verbose.custom("Displaying CPU information...");
    _showKeyValue(
      batteryData,
      new Map([
        ["hasBattery", "Has Battery"],
        ["cycleCount", "Cycle Count"],
        ["isCharging", "Charging"],
        ["designedCapacity", "Designed Capacity (mWh)"],
        ["maxCapacity", "Max Capacity (mWh)"],
        ["currentCapacity", "Current Capacity (mWh)"],
        ["capacityUnit", "Capacity Unit"],
        ["voltage", "Voltage (V)"],
        ["percent", "Charge (%)"],
        ["timeRemaining", "Time Remaining (min)"],
        ["acConnected", "AC Connected"],
        ["type", "Battery Type"],
        ["model", "Model"],
        ["manufacturer", "Manufacturer"],
        ["serial", "Serial"],
      ]),
      false,
      ""
    );
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = battery;
