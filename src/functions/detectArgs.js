const _fatalError = require("./fatalError");

const args = process.argv.slice(2);
const arguments = {
  help: ["-h", "--help"],
  version: ["-v", "--version"],
  timebomb: ["--no-timebomb"],
  checks: ["--no-checks"],
  warnings: ["--no-timebomb"],
  dump: ["--no-dump"],
  reset: ["--reset"],
  verbose: ["--verbose"],
};

/**
 * Detects if the specified argument was passed into BubbleOS.
 *
 * @param {"help" | "version" | "timebomb" | "checks" | "warnings" | "dump" | "reset" | "verbose"} argument The name of the argument defined in the `arguments` object.
 * @returns `false` if the argument was not passed into BubbleOS, `true` if it was.
 */
const _detectArgs = (argument) => {
  try {
    if (!arguments[argument]) return false;
    return args.some((arg) => arguments[argument].includes(arg));
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _detectArgs;
