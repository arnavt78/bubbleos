const chalk = require("chalk");
const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _convertSize = require("../../functions/convertSize");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const mem = async (...args) => {
  try {
    console.log("Values will be beautified in the future, this is for testing! :)\n");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const memData = await si.mem();
    const memLayoutData = await si.memLayout();

    const memSizeData = {
      total: _convertSize(memData.total, 1),
      free: _convertSize(memData.free, 1),
      used: _convertSize(memData.used, 1),
      active: _convertSize(memData.active, 1),
      available: _convertSize(memData.available, 1),
      buffers: _convertSize(memData.buffers, 1),
      cached: _convertSize(memData.cached, 1),
      slab: _convertSize(memData.slab, 1),
      buffcache: _convertSize(memData.buffcache, 1),
      swaptotal: _convertSize(memData.swaptotal, 1),
      swapused: _convertSize(memData.swapused, 1),
      swapfree: _convertSize(memData.swapfree, 1),
      writeback: _convertSize(memData.writeback, 1),
      dirty: _convertSize(memData.dirty, 1),
    };

    for (let key in memSizeData) {
      const { size, unit } = memSizeData[key];

      if (size === 0 || isNaN(size) || typeof unit === "undefined") delete memData[key];
      else memData[key] = `${size} ${unit}`;
    }

    for (const layout of memLayoutData) {
      // Values to convert
      for (const key of ["size"]) {
        if (typeof layout[key] === "number") {
          const { size, unit } = _convertSize(layout[key], 1);

          if (!isNaN(size) && typeof unit !== "undefined") layout[key] = `${size} ${unit}`;
          else delete layout[key];
        }
      }
    }

    spinner.stop();
    Verbose.stopSpinner();

    Verbose.custom("Displaying memory information...");
    console.log(chalk.cyanBright.underline.bold("General Memory Information"));
    _showKeyValue(
      memData,
      new Map([
        ["total", "Total Memory"],
        ["free", "Free Memory"],
        ["used", "Used Memory"],
        ["active", "Active Memory"],
        ["available", "Available Memory"],
        ["buffers", "Buffers"],
        ["cached", "Cached"],
        ["slab", "Slab"],
        ["buffcache", "Buffer Cache"],
        ["swaptotal", "Swap Total"],
        ["swapused", "Swap Used"],
        ["swapfree", "Swap Free"],
        ["writeback", "Writeback"],
        ["dirty", "Dirty"],
      ]),
      false,
      ""
    );

    console.log(chalk.cyanBright.underline.bold("Physical Memory Layout"));
    memLayoutData.forEach((layout, idx) => {
      _showKeyValue(
        layout,
        new Map([
          ["size", "Size"],
          ["bank", "Bank"],
          ["type", "Type"],
          ["ecc", "ECC"],
          ["clockSpeed", "Clock Speed"],
          ["formFactor", "Form Factor"],
          ["manufacturer", "Manufacturer"],
          ["partNum", "Part Number"],
          ["serialNum", "Serial Number"],
          ["voltageConfigured", "Configured Voltage (V)"],
          ["voltageMin", "Min Voltage (V)"],
          ["voltageMax", "Max Voltage (V)"],
        ]),
        false,
        `Memory Layout ${idx + 1}`
      );
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = mem;
