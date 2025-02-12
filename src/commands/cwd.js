const _fatalError = require("../functions/fatalError");

const Verbose = require("../classes/Verbose");

/**
 * Prints the current working directory of BubbleOS.
 */
const cwd = (...args) => {
  try {
    Verbose.custom("Outputting current working directory...");
    console.log(process.cwd() + "\n");
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = cwd;
