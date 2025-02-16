const chalk = require("chalk");

const ALL_TIPS = require("../data/tips.json");

const { GLOBAL_NAME } = require("../variables/constants");

const _fatalError = require("../functions/fatalError");

const Verbose = require("../classes/Verbose");

/**
 * Shuffles the array provided to have its values
 * in a random order.
 *
 * @param {any[]} arr The array to shuffle.
 * @returns The shuffled array.
 */
const _shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap the elements at i and randomIndex
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }

  return arr;
};

// Tips that are available, so as to not be chosen again
let availableTips = _shuffleArray([...ALL_TIPS]);

/**
 * Show some tips and fun facts about BubbleOS.
 *
 * @param {...string} args Arguments to modify the behavior of `tips`.
 */
const tips = (...args) => {
  try {
    Verbose.custom(`Tips in 'ALL_TIPS': ${ALL_TIPS.length}`);
    Verbose.custom(`Tips in 'availableTips': ${availableTips.length}`);

    // Resets tips if there are no more
    if (availableTips.length === 0) {
      Verbose.custom("Resetting tips...");
      availableTips = _shuffleArray([...ALL_TIPS]);
    }

    for (let i = 0; i < availableTips.length; i++) {
      Verbose.custom("Removing tip that is to be shown...");
      const tip = availableTips.pop();

      Verbose.custom("Showing tip...");
      console.log(
        chalk.hex("#FFA500")`${chalk.bold("TIP:")} ${tip.replaceAll(
          "{GLOBAL_NAME}",
          GLOBAL_NAME
        )}\n`
      );
      return;
    }
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = tips;
