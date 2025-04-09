const chalk = require("chalk");

const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const env = (...args) => {
  try {
    for (const [key, value] of Object.entries(process.env).sort((a, b) =>
      a[0].localeCompare(b[0], "en", { sensitivity: "base" })
    )) {
      console.log(`${chalk.green(key)}: ${value}`);
    }

    console.log();
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = env;
