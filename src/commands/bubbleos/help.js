const chalk = require("chalk");
const sortKeys = require("sort-keys");

const HELP_MESSAGES = require("../../data/helpMsgs.json");
const { GLOBAL_NAME } = require("../../variables/constants");

const _nonFatalError = require("../../functions/nonFatalError");
const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const Verbose = require("../../classes/Verbose");

/**
 * Print help depending on if the user requested
 * a single command, or if they wanted all available commands.
 *
 * @param {{}} sorted The object containing the sorted version of the help messages.
 * @param {boolean} specific If the user requested help on a specific command or not. If true, `cmd` must be passed.
 * @param {string} cmd The command that the user requested specific help on.
 */
const _printHelp = (sorted, specific, cmd) => {
  cmd = cmd?.toLowerCase();

  if (specific) {
    if (!cmd)
      throw new TypeError("Argument 'cmd' must have a value if specific command data requested");

    // Search for the command across all categories
    let commandData;
    for (const category of Object.keys(sorted)) {
      if (sorted[category].hasOwnProperty(cmd)) {
        commandData = sorted[category][cmd];
        break;
      }
    }

    if (!commandData) {
      Errors.unrecognizedCommand(cmd);
      return;
    }

    // Show the usage information
    Verbose.custom("Showing command and usage...");
    console.log(`${chalk.green.bold(cmd)}: ${chalk.yellow.italic(commandData.usage ?? "N/A")}`);

    // Show the description
    Verbose.custom("Showing description of command...");
    console.log(
      `\n  ${chalk.white(commandData.desc.replace("{GLOBAL_NAME}", GLOBAL_NAME) ?? "N/A")}\n`
    );

    // If there are arguments, list them
    Verbose.custom("Checking if arguments are available...");
    if (commandData.args && Object.keys(commandData.args).length !== 0) {
      Verbose.custom("Showing arguments...");
      console.log("  " + chalk.cyan.underline("Arguments:"));

      for (const arg in commandData.args) {
        console.log(
          `    ${chalk.magenta(arg.padEnd(15))} ${chalk.dim(
            commandData.args[arg].replace("{GLOBAL_NAME}", GLOBAL_NAME)
          )}`
        );
      }
      console.log();
    }
    return;
  } else {
    Verbose.custom("Showing all commands...");
    for (const category of Object.keys(sorted)) {
      console.log(chalk.cyan.bold.underline(`${category} Commands`));

      // Sort the commands for the category
      const commands = sortKeys(sorted[category]);
      let finalStr = "";
      let commandCount = 0;

      // Loop through each command in the category
      for (const commandKey of Object.keys(commands)) {
        if (commands[commandKey].hardAlias === false) {
          finalStr += chalk.green(commandKey.padEnd(15));
          commandCount++;

          // Add a newline every three commands
          if (commandCount % 3 === 0) {
            finalStr += "\n";
          }
        }
      }
      if (commandCount > 0 && commandCount % 3 !== 0) {
        finalStr += "\n";
      }
      console.log(finalStr);
    }
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
    Verbose.custom("Sorting help messages by category...");
    const sorted = sortKeys(HELP_MESSAGES);

    if (new Checks(command).paramUndefined()) {
      Verbose.custom("No specific command passed, showing all commands by category...");
      _printHelp(sorted, false);
      console.log(
        chalk.bold(
          `To get information about a specific command, run '${chalk.italic("help <command>")}'.\n`
        )
      );
    } else {
      Verbose.custom(`Looking for command ${command}...`);
      _printHelp(sorted, true, command.toLowerCase());
    }
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = help;
