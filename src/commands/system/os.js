const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const os = async (...args) => {
  try {
    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const osData = await si.osInfo();
    const shellData = await si.shell();

    osData.platform = osData.platform.replace(/\b\w/g, (a) => a.toUpperCase());
    osData.shell = shellData;

    spinner.stop();
    Verbose.stopSpinner();

    Verbose.custom("Displaying OS information...");
    _showKeyValue(
      osData,
      new Map([
        ["platform", "OS Platform"],
        ["distro", "Distribution"],
        ["release", "Release Version"],
        ["codename", "Codename"],
        ["kernel", "Kernel Version"],
        ["arch", "Architecture"],
        ["hostname", "Hostname"],
        ["fqdn", "Fully Qualified Domain Name"],
        ["codepage", "Codepage"],
        ["logofile", "Logo File"],
        ["serial", "Serial Number"],
        ["build", "Build"],
        ["servicepack", "Service Pack Version"],
        ["uefi", "UEFI Support"],
        ["hypervisor", "Hyper-V"], // Documentation says "hypervizor"
        ["hypervizor", "Hyper-V"], // but key name is actually "hypervisor"
        ["remoteSession", "Remote Session"],
        ["shell", "Shell"],
      ]),
      false,
      ""
    );
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = os;
