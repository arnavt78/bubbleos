const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _convertSize = require("../../functions/convertSize");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const hardware = async (...args) => {
  try {
    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const systemData = await si.system();
    const biosData = await si.bios();
    const baseboardData = await si.baseboard();
    const chassisType = await si.chassis();

    baseboardData.memMax = `${_convertSize(baseboardData.memMax, 1).size} ${
      _convertSize(baseboardData.memMax, 1).unit
    }`;
    delete biosData.features;

    spinner.stop();
    Verbose.stopSpinner();

    _showKeyValue(
      systemData,
      new Map([
        ["manufacturer", "Manufacturer"],
        ["model", "Model/Product"],
        ["version", "Version"],
        ["serial", "Serial Number"],
        ["uuid", "UUID"],
        ["sku", "SKU Number"],
        ["virtual", "Virtual Machine"],
        ["virtualHost", "Virtual Host"],
      ]),
      false,
      "System"
    );

    _showKeyValue(
      biosData,
      new Map([
        ["vendor", "Vendor"],
        ["version", "Version"],
        ["releaseDate", "Release Date"],
        ["revision", "Revision"],
        ["serial", "Serial Number"],
        ["language", "BIOS Language"],
      ]),
      false,
      "BIOS"
    );

    _showKeyValue(
      baseboardData,
      new Map([
        ["manufacturer", "Manufacturer"],
        ["model", "Model/Product"],
        ["version", "Version"],
        ["serial", "Serial Number"],
        ["assetTag", "Asset Tag"],
        ["memMax", "Max Memory Capacity"],
        ["memSlots", "Memory Slots"],
      ]),
      false,
      "Baseboard"
    );

    _showKeyValue(
      chassisType,
      new Map([
        ["manufacturer", "Manufacturer"],
        ["model", "Model/Product"],
        ["type", "Chassis Type"],
        ["version", "Version"],
        ["serial", "Serial Number"],
        ["assetTag", "Asset Tag"],
        ["sku", "SKU Number"],
      ]),
      false,
      "Chassis"
    );
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = hardware;
