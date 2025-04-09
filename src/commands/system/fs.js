const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _convertSize = require("../../functions/convertSize");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const fs = async (...args) => {
  try {
    console.log("Values will be beautified in the future, this is for testing! :)\n");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const fsData = await si.fsSize();

    spinner.stop();
    Verbose.stopSpinner();

    fsData.forEach((value) => {
      value.size = `${_convertSize(value.size, 1).size} ${_convertSize(value.size, 1).unit}`;
      value.used = `${_convertSize(value.used, 1).size} ${_convertSize(value.used, 1).unit}`;
      value.available = `${_convertSize(value.available, 1).size} ${
        _convertSize(value.available, 1).unit
      }`;
      value.use = `${value.use}%`;
      value.rw = !value.rw ? "Read-Only" : "Yes";

      _showKeyValue(
        value,
        new Map([
          ["fs", "Name"],
          ["type", "Type"],
          ["size", "Size"],
          ["used", "Used"],
          ["available", "Available"],
          ["use", "Used"],
          ["mount", "Mount Point"],
          ["rw", "Read/Write"],
        ]),
        "fs"
      );
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = fs;
