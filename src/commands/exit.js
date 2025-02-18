const { GLOBAL_NAME } = require("../variables/constants");

const _promptForYN = require("../functions/promptForYN");
const _fatalError = require("../functions/fatalError");

const Verbose = require("../classes/Verbose");
const SettingManager = require("../classes/SettingManager");

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
    if (new SettingManager().checkSetting("confirmExit")) {
      Verbose.promptUser();
      if (!_promptForYN(`Are you sure you want to exit ${GLOBAL_NAME}?`)) {
        Verbose.declinePrompt();
        console.log();
        return;
      }
    }

    console.log(`Exiting the ${GLOBAL_NAME} shell...\n`);

    // If the user requested to clear the screen after exiting
    if (args.includes("-c")) {
      process.stdout.write("\x1bc");
      Verbose.custom("Cleared screen.");
    }

    // Exit with exit code of '0' (success)
    Verbose.exitProcess();
    process.exit(0);
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = exit;
