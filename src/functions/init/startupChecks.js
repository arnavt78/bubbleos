const os = require("os");

const { GLOBAL_NAME } = require("../../variables/constants");

const _startupError = require("./startupError");
const _fatalError = require("../fatalError");

const Verbose = require("../../classes/Verbose");

/**
 * Checks if BubbleOS is running on x64 architecture or Windows 10 and above.
 */
const startupChecks = () => {
  try {
    Verbose.custom("Checking if system is not x64 or ARM64 architecture...");
    if (!(process.arch === "x64" || process.arch === "arm64")) {
      // Running on x86 hardware
      Verbose.custom(`${GLOBAL_NAME} has been detected to run on unsupported hardware.`);
      _startupError(
        `${GLOBAL_NAME} can only run on the x64 processor architecture. Please use a device with a processor that supports the x64 architecture.`,
        false
      );
    }

    if (process.platform === "win32" && /^6\.(0|1|2|3)/.test(os.release())) {
      // Running on Windows 8.1 or below
      Verbose.custom(`${GLOBAL_NAME} has been detected to run on unsupported software.`);
      _startupError(
        `${GLOBAL_NAME} cannot run on Windows 8.1 and below. Please use a device which runs Windows 10 LTSC and later.`,
        false
      );
    }
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = startupChecks;
