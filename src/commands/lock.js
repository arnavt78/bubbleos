const lockSystem = require("lock-system");

const { GLOBAL_NAME } = require("../variables/constants");

const _friendlyOS = require("../functions/friendlyOS");
const _fatalError = require("../functions/fatalError");

const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

const lock = (...args) => {
  try {
    // Locks the system, not just BubbleOS
    Verbose.custom("Locking the system...");
    lockSystem();

    InfoMessages.success(`${GLOBAL_NAME} has successfully locked ${_friendlyOS()}!`);
  } catch (err) {
    if (err.message.toLowerCase().includes("unsupported os")) {
      Verbose.custom(`The operating system does not support locking by ${GLOBAL_NAME}.`);
      InfoMessages.error(
        "Locking the OS failed due to it being run on an unsupported operating system."
      );
    } else if (err.message.toLowerCase().includes("no applicable command found")) {
      Verbose.custom("No command was found to lock the system on Linux.");
      InfoMessages.error("Locking the OS failed. Please install xdg-screensaver and try again.");
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = lock;
