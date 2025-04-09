const chalk = require("chalk");

/**
 * Render a percentage bar.
 *
 * @param {number} percentage The percentage number out of a hundred, which is the part of the bar that is filled in.
 * @param {"black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright"} color Color of the progress bar (the filled-in part). Defaults to `white`.
 * @param {number} width Width of the percentage bar, defaults to `30`.
 */
const _percentBar = (percentage, color = "white", width = 30) => {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;

  const fillColor = chalk[color] || chalk.white;
  const filledBar = fillColor("█".repeat(filled));
  const emptyBar = " ".repeat(empty);

  return `[${filledBar}${emptyBar}]`;
};

module.exports = _percentBar;
