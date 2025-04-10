const chalk = require("chalk");
const si = require("systeminformation");
const ora = require("ora");

const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const users = async (...args) => {
  try {
    const advanced = args.includes("-a");

    Verbose.startSpinner();
    const spinner = ora({ text: "Please wait..." }).start();

    const data = await si.users();

    spinner.stop();
    Verbose.stopSpinner();

    data.forEach((user) => {
      console.log(chalk.bold.red(user.user));
      console.log(`Logged in at ${user.time} on ${user.date}.\n`);

      if (advanced) {
        console.log(`Terminal: ${user.tty}`);
        if (user.ip) console.log(`Remote Login IP: ${user.ip}`);

        console.log();
      }
    });
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = users;
