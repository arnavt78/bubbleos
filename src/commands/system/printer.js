const chalk = require("chalk");

const printer = (...args) => {
  console.log(chalk.italic("Command functionality not available.\n"));
};

module.exports = printer;
