const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const cpu = async (...args) => {
  try {
    console.log("Values will be beautified in the future, this is for testing! :)\n");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const cpuData = await si.cpu();
    const cpuTempData = await si.cpuTemperature();

    delete cpuData.cache;
    delete cpuTempData.cores;
    delete cpuTempData.socket;

    if (cpuTempData.main && cpuTempData.max) {
      Verbose.custom("CPU temperature data found.");
      cpuData.main = cpuTempData.main;
      cpuData.max = cpuTempData.max;
      cpuData.chipset = cpuTempData.chipset;
    }

    spinner.stop();
    Verbose.stopSpinner();

    Verbose.custom("Displaying CPU information...");
    _showKeyValue(
      cpuData,
      new Map([
        ["manufacturer", "Manufacturer"],
        ["brand", "Brand"],
        ["speed", "Speed (GHz)"],
        ["speedMin", "Min Speed (GHz)"],
        ["speedMax", "Max Speed (GHz)"],
        ["governor", "Governor"],
        ["cores", "Cores"],
        ["physicalCores", "Physical Cores"],
        ["performanceCores", "Performance Cores"],
        ["efficiencyCores", "Efficiency Cores"],
        ["processors", "Processors"],
        ["socket", "Socket"],
        ["vendor", "Vendor"],
        ["family", "Family"],
        ["model", "Model"],
        ["stepping", "Stepping"],
        ["revision", "Revision"],
        ["voltage", "Voltage (V)"],
        ["flags", "Flags"],
        ["virtualization", "Virtualization"],
        ["main", "Average Temperature (°C)"],
        ["max", "Max Temperature (°C)"],
        ["chipset", "Chipset Temperature (°C)"],
      ]),
      false,
      ""
    );
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = cpu;
