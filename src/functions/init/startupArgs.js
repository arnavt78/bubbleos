const chalk = require("chalk");

const { GLOBAL_NAME } = require("../../variables/constants");

const Verbose = require("../../classes/Verbose");

const _startupArgs = () => {
  console.log(chalk.bold.underline(`${GLOBAL_NAME} Startup Arguments List`));

  const argInfo = {
    "-h": `Displays this help menu for arguments used in launching ${GLOBAL_NAME}.`,
    "-v": `Displays the version of ${GLOBAL_NAME}.`,
    "--no-timebomb": `Disables checking the ${GLOBAL_NAME} timebomb.`,
    "--no-checks": "Disables checking if the OS is 64-bit or if it is Windows 8.1 or below.",
    "--no-warnings": "Disables showing startup warnings when using some arguments.",
    "--no-intro": "Disables showing the intro on startup entirely.",
    "--no-dump": "Disables the fatal error file dump feature.",
    "--reset": `Resets the ${GLOBAL_NAME} configuration file.`,
    "--verbose": "Enables verbose mode to give more information on processes.",
  };

  // Sorts keys alphabetically
  Verbose.custom("Sorting arguments alphabetically...");
  const sorted = Object.entries(argInfo).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  // Get character length of longest key for purposes of table
  Verbose.custom("Finding maximum character length of arguments...");
  const maxKeyLength = Math.max(...sorted.map(([key]) => key.length));

  // Format each key-value pair
  Verbose.custom("Formatting argument and definition pair...");
  const formattedLines = sorted.map(
    ([key, value]) => `${key.padEnd(maxKeyLength, " ")}   ${value}`
  );
  Verbose.custom("Printing lines...");
  console.log(formattedLines.join("\n"));

  console.log();
};

module.exports = _startupArgs;
