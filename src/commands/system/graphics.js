const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _convertSize = require("../../functions/convertSize");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const graphics = async (...args) => {
  try {
    console.log("Values will be beautified in the future, this is for testing! :)\n");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const { controllers, displays } = await si.graphics();

    spinner.stop();
    Verbose.stopSpinner();

    controllers.forEach((controller) => {
      // VRAM is in megabytes by default, needs to be converted to bytes
      // for function to work correctly
      controller.vram = `${_convertSize(controller.vram * 1024 ** 2).size} ${
        _convertSize(controller.vram * 1024 ** 2).unit
      }`;

      _showKeyValue(
        controller,
        new Map([
          ["vendor", "Vendor"],
          ["subVendor", "Sub-Vendor"],
          ["model", "Model"],
          ["bus", "Bus"],
          ["vram", "VRAM"],
          ["vramDynamic", "Dynamic VRAM"],
          ["deviceId", "Device ID"],
          ["vendorId", "Vendor ID"],
          ["external", "External GPU"],
          ["cores", "GPU Cores"],
          ["metalVersion", "Metal Version"],
          ["subDeviceId", "Sub Device ID"],
          ["driverVersion", "Driver Version"],
          ["name", "Name"],
          ["pciBus", "PCI Bus ID"],
          ["fanSpeed", "Fan Speed"],
          ["memoryTotal", "Memory Total"],
          ["memoryUsed", "Memory Used"],
          ["memoryFree", "Memory Free"],
          ["utilizationGpu", "GPU Utilization"],
          ["utilizationMemory", "Memory Utilization"],
          ["temperatureGpu", "GPU Temp"],
          ["temperatureMemory", "Memory Temp"],
          ["powerDraw", "Power Draw"],
          ["powerLimit", "Power Limit"],
          ["clockCore", "Core Clock"],
          ["clockMemory", "Memory Clock"],
        ]),
        "model"
      );
    });

    displays.forEach((display, idx) => {
      _showKeyValue(
        display,
        new Map([
          ["vendor", "Vendor"],
          ["vendorId", "Vendor ID"],
          ["deviceName", "Device Name"],
          ["model", "Model"],
          ["productionYear", "Production Year"],
          ["serial", "Serial Number"],
          ["displayId", "Display ID"],
          ["main", "Main Display"],
          ["builtin", "Built-in"],
          ["connection", "Connection Type"],
          ["sizeX", "Width (mm)"],
          ["sizeY", "Height (mm)"],
          ["pixelDepth", "Color Depth"],
          ["resolutionX", "Resolution X"],
          ["resolutionY", "Resolution Y"],
          ["currentResX", "Current Resolution X"],
          ["currentResY", "Current Resolution Y"],
          ["positionX", "Position X"],
          ["positionY", "Position Y"],
          ["currentRefreshRate", "Refresh Rate"],
        ]),
        false,
        `Display ${idx + 1}`
      );
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = graphics;
