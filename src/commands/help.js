const chalk = require("chalk");
const sortKeys = require("sort-keys");

const HELP_MESSAGES = require("../data/helpMsgs.json");

const { GLOBAL_NAME } = require("../variables/constants");

const _nonFatalError = require("../functions/nonFatalError");

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
    if (!cmd)
      throw new TypeError("Argument 'cmd' must have a value if specific command data requested");

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
    let commandCount = 0; // Track number of commands added to handle newlines properly

    for (let i = 1; i < Object.keys(sorted).length + 1; i++) {
      const commandKey = Object.keys(sorted)[i - 1];

      if (sorted[commandKey].hardAlias === false) {
        Verbose.custom(`Adding command '${commandKey}' to memory...`);
        finalStr += commandKey.padEnd(15);
        commandCount++;

        // If there have been three commands on the line, print a newline
        if (commandCount % 3 === 0) {
          Verbose.custom("Adding a newline...");
          finalStr += "\n";
        }
      }
    }

    if (commandCount > 0 && commandCount % 3 !== 0) {
      finalStr += "\n";
    }

    console.log(finalStr);
  }
};

/**
 * The 'help' command, which provides detailed help
 * on how to use commands in the BubbleOS shell.
 *
 * @param {string} command Optionally get help on a specific command.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
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
          `To get information about a specific command, run '${chalk.italic("help <command>")}'.\n`
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
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = help;
