import chalk from "chalk";

import _errorInterpret from "../functions/errorInt.js";

const history = [];
const NUMBER_TO_STORE = 50;

const historyCmd = (numToDisplay) => {
  const _formatHist = (index, histCmd) => {
    console.log(`  ${index}: ${chalk.bold.yellow(histCmd)}`);
  };

  if (typeof numToDisplay === "undefined") {
    if (history.length === 0) {
      _errorInterpret(44);
      return;
    } else {
      for (const [idx, value] of history.entries()) {
        _formatHist(idx + 1, value);
      }
    }

    console.log();
    return;
  }

  if (numToDisplay % 1 !== 0) {
    _errorInterpret(10, {
      type: "history point",
      supposedTo: "numbers",
      notContain: "letters/symbols",
      variable: numToDisplay,
    });
    return;
  } else if (typeof history[numToDisplay - 1] === "undefined") {
    console.log(chalk.yellow("No history is available."));
    return;
  }

  _formatHist(numToDisplay, history[numToDisplay - 1]);
  console.log();
};

const _addToHist = (command) => {
  history.push(command);
  if (history.length > NUMBER_TO_STORE) {
    history.shift();
  }
};

export { historyCmd, _addToHist };
