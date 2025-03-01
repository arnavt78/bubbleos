const _nonFatalError = require("../functions/nonFatalError");

const Verbose = require("../classes/Verbose");

/**
 * Clears the entire standard output.
 *
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const cls = (...args) => {
  try {
    // Note console.clear() only clears visible stdout
    // on Windows, therefore this works better
    process.stdout.write("\x1bc");
    Verbose.custom("Cleared screen.");
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = cls;
