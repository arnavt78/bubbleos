const chalk = require("chalk");
const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _convertSize = require("../../functions/convertSize");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const disks = async (...args) => {
  try {
    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const diskLayoutData = await si.diskLayout();
    const blockDevicesData = await si.blockDevices();

    spinner.stop();
    Verbose.stopSpinner();

    console.log(chalk.cyanBright.underline.bold("Disk Layout"));
    diskLayoutData.forEach((disk) => {
      disk.size = `${_convertSize(disk.size, 1).size} ${_convertSize(disk.size, 1).unit}`;

      _showKeyValue(
        disk,
        new Map([
          ["device", "Device"],
          ["type", "Type"],
          ["name", "Name"],
          ["vendor", "Vendor"],
          ["size", "Size"],
          ["totalCylinders", "Total Cylinders"],
          ["totalHeads", "Total Heads"],
          ["totalTracks", "Total Tracks"],
          ["totalSectors", "Total Sectors"],
          ["tracksPerCylinder", "Tracks per Cylinder"],
          ["sectorsPerTrack", "Sectors per Track"],
          ["bytesPerSector", "Bytes per Sector"],
          ["firmwareRevision", "Firmware Revision"],
          ["serialNum", "Serial Number"],
          ["interfaceType", "Interface Type"],
          ["smartStatus", "S.M.A.R.T Status"],
          ["temperature", "Temperature"],
        ]),
        "name"
      );
    });

    console.log(chalk.cyanBright.underline.bold("Block Devices"));
    blockDevicesData.forEach((block) => {
      block.size = `${_convertSize(block.size, 1).size} ${_convertSize(block.size, 1).unit}`;

      _showKeyValue(
        block,
        new Map([
          ["name", "Name"],
          ["type", "Type"],
          ["fsType", "Filesystem Type"],
          ["mount", "Mount Point"],
          ["size", "Size"],
          ["physical", "Physical Type"],
          ["uuid", "UUID"],
          ["label", "Label"],
          ["model", "Model"],
          ["serial", "Serial"],
          ["removable", "Removable"],
          ["protocol", "Protocol"],
          ["group", "RAID Group"],
          ["device", "Device"],
        ]),
        "name"
      );
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = disks;
