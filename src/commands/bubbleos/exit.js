const _nonFatalError = require("../../functions/nonFatalError");
const _exit = require("../../functions/exit");

const Verbose = require("../../classes/Verbose");

/**
 * Exit the BubbleOS shell with an exit code of
 * `0` (success).
 *
 * Available arguments:
 * - `-c`: Clears the _stdout_ (standard output) after
 * BubbleOS has completed shutting down completely
 * (similar to `cls()`).
 *
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const exit = (...args) => {
  try {
    _exit(true, args.includes("-c"));
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = exit;
