const chalk = require("chalk");
const si = require("systeminformation");
const ora = require("ora");

const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const os = async (...args) => {
  try {
    const advanced = args.includes("-a");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const osData = await si.osInfo();

    spinner.stop();
    Verbose.stopSpinner();

    Verbose.custom("Displaying OS information...");

    console.log(chalk.bold(`${osData.distro} (${osData.arch})`));
    console.log(chalk.dim(`Release: ${osData.release}\n`));
    console.log(
      osData.uefi ? "This device supports UEFI.\n" : "This device does not support UEFI.\n"
    );

    if (advanced) {
      console.log(`Build ${osData.build}, Service Pack ${parseInt(osData.servicepack)}`);
      console.log(chalk.dim(`Kernel version: ${osData.kernel}`));
      console.log(chalk.dim(`Character encoding: ${osData.codepage}`));
      console.log(chalk.dim(`Logo file: ${osData.logofile}`));

      console.log();
    }

    console.log(`Computer name: ${chalk.bold(osData.hostname)}`);
    console.log(`Fully Qualified Domain Name (FQDN): ${chalk.bold(osData.fqdn)}`);

    console.log();

    if (osData.hypervizor) console.log("Running in Hyper-V.\n");
    if (osData.remoteSession) console.log("Running in a remote session.\n");
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = os;
