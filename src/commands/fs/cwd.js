const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

/**
 * Prints the current working directory of BubbleOS.
 *
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const cwd = (...args) => {
  try {
    Verbose.custom("Outputting current working directory...");
    console.log(process.cwd() + "\n");
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = cwd;
