const _intCmds = require("../interpret");

const Verbose = require("../../classes/Verbose");

/**
 * The pre-boot interpreter of BubbleOS.
 */
const _preBootInterpreter = async () => {
  Verbose.custom("Getting arguments passed into executable...");
  const args = process.argv.slice(2);

  Verbose.custom("Detecting if pre-boot interpreter was invoked...");
  if (!args[0]?.startsWith("-") && args.length !== 0) {
    Verbose.custom("Running the command given to the pre-boot interpreter...");
    await _intCmds(args.join(" "));
    process.exit(0);
  }
};

module.exports = _preBootInterpreter;
