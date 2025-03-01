const _nonFatalError = require("../functions/nonFatalError");

const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");

/**
 * Print text to screen.
 *
 * @param {...string} text The text to output.
 */
const print = (...text) => {
  try {
    // If no text passed, print nothing at all
    if (new Checks(text).paramUndefined()) {
      Verbose.chkEmpty();
      console.log();
      return;
    }

    // Print the text, and end it with a newline
    Verbose.custom("Printing text...");
    console.log(text.join(" ") + "\n");
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = print;
