const chalk = require("chalk");

const { GLOBAL_NAME } = require("../../variables/constants");

const _fatalError = require("../fatalError");

/**
 * Check if the terminal supports color.
 */
const _colorSupport = () => {
  try {
    if (!chalk.supportsColor) {
      console.log(
        `${GLOBAL_NAME} requires the terminal to support at least 16 colors. Exiting...\n`
      );
      process.exit(1);
    }
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _colorSupport;
