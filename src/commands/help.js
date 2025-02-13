const chalk = require("chalk");
const sortKeys = require("sort-keys");

const HELP_MESSAGES = require("../data/helpMsgs.json");

const { GLOBAL_NAME } = require("../variables/constants");

const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");

/**
 * Print help depending on if the user requested
 * a single command, or if they wanted all
 * available commands.
 *
 * @param {{}} sorted The object containing the sorted version of the help messages.
 * @param {boolean} specific If the user requested help on a specific command or not. If this is `true`, `cmd` must also be passed.
 * @param {string} cmd The command that the user requested specific help on.
 */
const _printHelp = (sorted, specific, cmd) => {
  cmd = cmd?.toLowerCase();

  if (specific) {
    // If the usage is not available, show 'N/A'
    Verbose.custom("Showing command and usage...");
    console.log(`${chalk.bold(cmd)}: ${chalk.italic(sorted[cmd].usage ?? "N/A")}`);

    // Show the description (if it is unavailable, show 'N/A')
    Verbose.custom("Showing description of command...");
    console.log(`\n  ${sorted[cmd].desc.replace("{GLOBAL_NAME}", GLOBAL_NAME) ?? "N/A"}\n`);

    // If there are arguments
    Verbose.custom("Checking if arguments are available...");
    if (typeof sorted[cmd].args !== "undefined") {
      if (Object.keys(sorted[cmd].args).length !== 0) {
        Verbose.custom("Showing arguments...");
        console.log("  " + chalk.underline("Arguments:"));

        for (const arg in sorted[cmd].args) {
          console.log(
            `    ${arg.padEnd(15)} ${sorted[cmd].args[arg].replace("{GLOBAL_NAME}", GLOBAL_NAME)}`
          );
        }

        console.log();
      }
    }

    return;
  } else {
    Verbose.custom("Showing all commands...");
    let finalStr = "";

    // Loop through all of the keys of the help object (sorted)
    for (let i = 1; i < Object.keys(sorted).length + 1; i++) {
      Verbose.custom(`Adding command '${Object.keys(sorted)[i - 1]}' to memory...`);
      finalStr += Object.keys(sorted)[i - 1].padEnd(15);

      // If there have been three characters on the line, print a newline
      if (i % 3 === 0) {
        Verbose.custom("Adding a newline...");
        finalStr += "\n";
      }
    }

    // Show the final string
    Verbose.custom("Showing all commands...");
    console.log(finalStr);
  }
};

/**
 * The 'help' command, which provides detailed help
 * on how to use commands in the BubbleOS shell. This
 * command is only to be used in the BubbleOS CLI!
 *
 * Usage:
 *
 * ```js
 * // Arguments are also accepted!
 * help(); // Help on all commands
 * help("help"); // Help on a specific command
 * ```
 *
 * @param {string} command Optionally get help on a specific command.
 * @param {...string} args Arguments to modify the behavior of `help`.
 */
const help = (command, ...args) => {
  try {
    // Make a new array with a list of help messages sorted in alphabetical order
    Verbose.custom("Sorting help messages...");
    const sorted = sortKeys(HELP_MESSAGES);

    // If the user did not ask for help on a specific command
    if (new Checks(command).paramUndefined()) {
      // The user DID NOT want a specific command
      Verbose.custom("No command was passed, showing all commands...");
      _printHelp(sorted, false);

      console.log(
        chalk.bold(
          `\nTo get information about a specific command, run ${chalk.italic(
            "'help <command>'"
          )}.\n`
        )
      );
    } else {
      // If the user wanted information about a specific command
      Verbose.custom(`Showing information on command ${command}...`);

      // Check if the command exists in the sorted object
      if (sorted.hasOwnProperty(command.toLowerCase())) {
        Verbose.custom("Showing command information...");
        _printHelp(sorted, true, command.toLowerCase());
        return;
      }

      // The command didn't match any
      Verbose.custom(
        `Command '${command}' was detected to be unrecognized, show respective error...`
      );
      Errors.unrecognizedCommand(command);
    }
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = help;
