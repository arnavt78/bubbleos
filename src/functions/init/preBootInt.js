const _intCmds = require("../interpret");
const _fatalError = require("../fatalError");

const Verbose = require("../../classes/Verbose");

/**
 * The pre-boot interpreter of BubbleOS.
 */
const _preBootInterpreter = async () => {
  try {
    Verbose.custom("Getting arguments passed into executable...");
    const args = process.argv.slice(2);

    Verbose.custom("Detecting if pre-boot interpreter was invoked...");
    if (!args[0]?.startsWith("-") && args.length !== 0) {
      Verbose.custom("Running the command given to the pre-boot interpreter...");
      await _intCmds(args.join(" "));
      process.exit(0);
    }
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _preBootInterpreter;
