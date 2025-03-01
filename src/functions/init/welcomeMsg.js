const cfonts = require("cfonts");
const boxen = require("boxen");
const chalk = require("chalk");
const { question } = require("readline-sync");

const { GLOBAL_NAME } = require("../../variables/constants");

const _fatalError = require("../fatalError");

const _welcomeMsg = () => {
  try {
    cfonts.say(GLOBAL_NAME, {
      font: "block", // Closest to "ANSI Shadow"
      align: "left",
      gradient: ["red", "yellow", "green", "cyan", "blue", "magenta"], // Full rainbow effect
      independentGradient: true, // Apply gradient per letter
      transitionGradient: true, // Smooth transition
      letterSpacing: 1,
      lineHeight: 1,
    });

    console.log(
      boxen(`It looks like this is the first time you've run ${GLOBAL_NAME}! Welcome!\n`, {
        padding: 1,
        margin: 0,
        borderStyle: "bold",
        borderColor: "blue",
        title: chalk.blue.bold(`Welcome to ${GLOBAL_NAME}!`),
        titleAlignment: "center",
      })
    );

    console.log();
    question(chalk.cyan("Press the Enter key to continue . . . "), {
      hideEchoBack: true,
      mask: "",
    });

    console.log();
    console.log(chalk.cyan("─".repeat(process.stdout.columns / 2 || 40)));
    console.log();
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _welcomeMsg;
