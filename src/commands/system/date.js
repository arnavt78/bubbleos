const chalk = require("chalk");

const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

/**
 * All of the days of the week in order.
 */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/**
 * All of the months of the year in order.
 */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Show the current date from the local system to display in BubbleOS using the `date` command.
 *
 * This command will output the 'friendly' date, as well as the 'slash' date.
 *
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const date = (...args) => {
  try {
    Verbose.custom("Getting current date...");
    const date = new Date();

    // The friendly date, that will have either a _-st_, _-nd_, _-rd_, or _-th_ suffix.
    Verbose.custom("Creating user-friendly date...");
    const friendlyDate =
      date.getDate() === 1 || date.getDate() === 21 || date.getDate() === 31
        ? `${date.getDate()}st`
        : date.getDate() === 2 || date.getDate() === 22
        ? `${date.getDate()}nd`
        : date.getDate() === 3 || date.getDate() === 23
        ? `${date.getDate()}rd`
        : `${date.getDate()}th`;

    // Friendly format
    Verbose.custom("Printing user-friendly date...");
    console.log(
      `${DAYS[date.getDay()]}, the ${friendlyDate} of ${
        MONTHS[date.getMonth()]
      }, ${date.getFullYear()}`
    );

    // Slash format
    Verbose.custom("Printing slash-format date...");
    console.log(
      chalk.dim(
        `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(
          2,
          "0"
        )}/${date.getFullYear()}`
      )
    );

    console.log();
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = date;
