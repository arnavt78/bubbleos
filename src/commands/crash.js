const chalk = require("chalk");
const { select } = require("@inquirer/prompts");
const isElevated = require("is-elevated");
const execa = require("execa");

const CRASHES_RAW = require("../data/crashes.json");

const { GLOBAL_NAME } = require("../variables/constants");

const _promptForYN = require("../functions/promptForYN");
const _nonFatalError = require("../functions/nonFatalError");
const _fatalError = require("../functions/fatalError");
const _exit = require("../functions/exit");

const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

const CRASHES = CRASHES_RAW.map((crash) => ({
  ...crash,
  name: crash.name.replace(/\{GLOBAL_NAME\}/g, GLOBAL_NAME),
  description: crash.description.replace(/\{GLOBAL_NAME\}/g, GLOBAL_NAME),
}));

/**
 * Crash BubbleOS and the terminal in many ways.
 *
 * BubbleOS will request the user to select a crashing method from a list
 * of elements. These are the following current ways that a user can crash
 * BubbleOS, their terminal, or even their computer:
 * - _Non-fatal error_: Throws a non-fatal error in BubbleOS. BubbleOS is still
 * operational after this.
 * - _Fatal error_: Crash BubbleOS with a fatal error. File dumping is
 * enabled.
 * - _Hang_: Hangs the terminal completely in some scenarios, making it
 * almost impossible to press `^C` and forcing the user to force shut it
 * down using a command such as `taskkill` on Windows, or `kill`/`killall`
 * on Linux (supposing you can use the terminal).
 * - _Memory leak_: Leaks memory from the computer by making multiple arrays.
 * This is a very dangerous command, especially for low-memory systems,
 * as it can leak about 4-8GB of memory.
 * - _Blue Screen of Death_: Causes a BSOD on Windows. This is a very dangerous command.
 *
 * @param {number | string} index Optional. Uses this as the index for the crashing method. Defaults to `NaN`.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const crash = async (...args) => {
  try {
    InfoMessages.warning(
      "Using this command can cause issues such as loss of data, high CPU/RAM usage, and more. Save all data before continuing."
    );

    Verbose.custom("Prompting user to select crashing method...");
    const index = await select({
      message: "Select a crashing method:",
      choices: CRASHES,
    });

    if (index === -1 || index === NaN) {
      // If the user 'cancelled' on the prompt
      Verbose.custom(`Index is either -1 or NaN (${index}), exiting...`);
      console.log(chalk.yellow("Process aborted.\n"));
      return;
    } else if (index > CRASHES.length || index <= 0) {
      // If the index is greater than the length of the crash array, or is less than 0
      // This should never happen :)
      Verbose.custom("Index is unknown, exiting...");
      console.log(chalk.yellow(`Unknown crash method at index ${index + 1}.\n`));
      return;
    }

    Verbose.promptUser();
    if (
      !_promptForYN(
        `You have chosen ${chalk.italic(
          `'${CRASHES[index - 1].name}'`
        )}. Are you sure you want to do this?`
      )
    ) {
      Verbose.declinePrompt();
      console.log(chalk.yellow("Process aborted.\n"));
      return;
    }

    console.log();

    if (index === 1) {
      // Non-fatal error
      Verbose.custom("Crashing method: non-fatal error.");
      throw new Error(`${GLOBAL_NAME} was purposely crashed with the 'crash' command`);
    } else if (index === 2) {
      // Fatal error
      Verbose.custom("Crashing method: fatal error.");
      try {
        throw new Error(`${GLOBAL_NAME} was purposely crashed with the 'crash' command`);
      } catch (err) {
        _fatalError(err);
      }
    } else if (index === 3) {
      // Crash BubbleOS by continuously writing 'clear screen' to the terminal.
      // This can make the terminal hang, and sometimes make it impossible to press ^C.
      Verbose.custom("Crashing method: hang.");
      while (true) {
        process.stdout.write("\x1bc");
      }
    } else if (index === 4) {
      // Node.js will crash once the heap has run out of memory
      Verbose.custom("Crashing method: memory leak.");
      InfoMessages.info(
        `${GLOBAL_NAME} will crash once memory usage has hit its maximum allocated memory space.`
      );

      // While 'i' is less than the maximum number that JS can handle,
      // add a new array to the 'crashArr' with 100000000 'null' elements
      const crashArr = [];
      for (let i = 0; i < Number.MAX_VALUE; i++) {
        crashArr.push(new Array(100000000));
      }
    } else if (index === 5) {
      Verbose.custom("Crashing method: BSOD.");

      if (process.platform !== "win32") {
        // Check if the computer is running Windows
        Verbose.custom("Computer is not running Windows, exiting...");
        InfoMessages.error("This crashing method only works on Windows.");
        return;
      } else if (!(await isElevated())) {
        // Check if the user is an administrator
        Verbose.custom("User is not an administrator, exiting...");
        InfoMessages.error(
          `You must run ${GLOBAL_NAME} as an administrator to crash the computer with a BSOD.`
        );
        return;
      }

      InfoMessages.warning(
        `${GLOBAL_NAME} does not take responsibility for any data loss due to this method being used incorrectly. Save all data before continuing, and use this method with extreme caution.`
      );

      // Prompt the user to make sure they want to crash their computer
      Verbose.promptUser();
      if (
        !_promptForYN(
          `This will crash your computer with a Blue Screen of Death, and cause all unsaved work to be lost. Are you sure you want to continue?`
        )
      ) {
        Verbose.declinePrompt();
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }

      // RIP computer
      Verbose.custom("Crashing computer with BSOD (rip computer)...");
      await execa("taskkill", ["/f", "/im", "svchost.exe"]);
    } else {
      // If, for some reason, the index didn't match any of the above
      // This should DEFINITELY never happen...
      Verbose.custom("Index did not match any options, throwing exception...");
      throw new Error(
        `Index ${index} (user-friendly value ${index + 1}) did not match any options`
      );
    }
  } catch (err) {
    if (err.name === "ExitPromptError") {
      // If the user presses Ctrl+C, exit BubbleOS gracefully
      Verbose.custom("Detected Ctrl+C, exiting...");
      _exit(false, false);
    } else if (err.message.toLowerCase().includes("exit code 1")) {
      // If the BSOD failed to run. This is usually due to Windows
      // 'taskkill' not existing/being blocked by the system.
      Verbose.custom(
        "Failed to crash Windows with a BSOD (usually due to 'taskkill' not existing or being blocked)..."
      );
      InfoMessages.error(`${GLOBAL_NAME} failed to crash Windows with a BSOD.`);
    } else {
      // If an unknown exception occurred, or the user selected
      // to purposely crash BubbleOS with a fatal error
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = crash;
