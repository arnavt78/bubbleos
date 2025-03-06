const _intCmds = require("../interpret");
const _fatalError = require("../fatalError");

const Verbose = require("../../classes/Verbose");
const InfoMessages = require("../../classes/InfoMessages");

/**
 * The list of commands that are prevented from running in the pre-boot interpreter.
 */
const COMMAND_BLACKLIST = ["cd", "exit", "history", "setmgr", "tips"];

/**
 * The pre-boot interpreter of BubbleOS.
 */
const _preBootInterpreter = async () => {
  try {
    Verbose.custom("Getting arguments passed into executable...");
    const args = process.argv.slice(2);

    Verbose.custom("Detecting if pre-boot interpreter was invoked...");
    if (!args[0]?.startsWith("-") && args.length !== 0) {
      Verbose.custom("Checking if command is blacklisted...");
      if (COMMAND_BLACKLIST.includes(args[0])) {
        Verbose.custom(`Command '${args[0]}' is blacklisted. Exiting...`);
        InfoMessages.error("This command is prevented from running in the pre-boot interpreter.");
        process.exit(0);
      }

      Verbose.custom("Running the command given to the pre-boot interpreter...");
      await _intCmds(args.join(" "));
      process.exit(0);
    }
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _preBootInterpreter;
