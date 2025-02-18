const chalk = require("chalk");

const { GLOBAL_NAME } = require("../../variables/constants");

/**
 * Check if the terminal supports color.
 */
const _colorSupport = () => {
  if (!chalk.supportsColor) {
    console.log(`${GLOBAL_NAME} requires the terminal to support at least 16 colors. Exiting...\n`);
    process.exit(1);
  }
};

module.exports = _colorSupport;
