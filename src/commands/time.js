const chalk = require("chalk");

const _fatalError = require("../functions/fatalError");

const Verbose = require("../classes/Verbose");

/**
 * Convert the time passed in to a twelve-hour format.
 *
 * @param {Date} time The time to convert.
 */
const _convertTime = (time) => {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) {
    // Remove full string match value
    time = time.slice(1);

    // Set AM/PM and adjust hours
    time[5] = +time[0] < 12 ? " AM" : " PM";
    time[0] = +time[0] % 12 || 12;
  }

  return time.join("");
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
 * @param {...string} args Arguments to modify the behavior of `time`.
 */
const time = (...args) => {
  try {
    // TODO fix bug in macOS/Linux where time will
    // not show AM/PM in 12-hour time
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
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = time;
