const _nonFatalError = require("../functions/nonFatalError");

const Verbose = require("../classes/Verbose");

/**
 * Convert the time passed in to a twelve-hour format.
 *
 * @param {Date} time The time to convert.
 */
const _convertTime = (time) => {
  const hours = new Date().getHours();
  const ampm = hours >= 12 ? " PM" : " AM";
  const hours12 = hours % 12 || 12;

  return time.replace(/^\d+/, hours12) + ampm;
};

/**
 * Show the current time from the local machine.
 *
 * By default, this command shows the time in 12-hour
 * time, however, this can be changed using an
 * argument.
 *
 * Available arguments:
 * - `-24`: Show the time in 24-hour time.
 *
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const time = (...args) => {
  try {
    Verbose.initArgs();
    const isTwelveHours = !args.includes("-24");

    // Get the time
    Verbose.custom("Getting the time...");
    const rawTime = new Date();
    const time = `${String(rawTime.getHours())}:${String(rawTime.getMinutes()).padStart(
      2,
      "0"
    )}:${String(rawTime.getSeconds()).padStart(2, "0")}`;

    // If the user wants the time in 24-hours, show it in raw format, else, convert it
    Verbose.custom("Printing the time in the specified format...");
    if (isTwelveHours) console.log(_convertTime(time));
    else console.log(time);

    console.log();
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = time;
