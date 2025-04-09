const si = require("systeminformation");
const ora = require("ora");

const _showKeyValue = require("../../functions/showKeyValue");
const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const users = async (...args) => {
  try {
    console.log("Values will be beautified in the future, this is for testing! :)\n");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const data = await si.users();

    spinner.stop();
    Verbose.stopSpinner();

    data.forEach((user) => {
      _showKeyValue(
        user,
        new Map([
          ["user", "Username"],
          ["tty", "Terminal"],
          ["date", "Login Date"],
          ["time", "Login Time"],
          ["ip", "Remote Login IP"],
          ["command", "Last Command or Shell"],
        ]),
        "user"
      );
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = users;
