const _fatalError = require("../functions/fatalError");
const _exit = require("../functions/exit");

const Verbose = require("../classes/Verbose");

/**
 * Exit the BubbleOS shell with an exit code of
 * `0` (success).
 *
 * This command is also used when the user presses
 * Ctrl+C to exit the shell (but only when on the
 * prompt).
 *
 * The exit command should not be used for generic
 * exiting. To exit because an unknown error occurred,
 * use the `_fatalError()` function instead.
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
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = exit;
