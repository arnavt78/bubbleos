/**
 * The global name used across the shell.
 */
const GLOBAL_NAME = "BubbleOS";
/**
 * The shorter version of `GLOBAL_NAME`.
 */
const SHORT_NAME = "Bubble";
/**
 * The name of the author who developed the shell.
 */
const AUTHOR = "Arnav Thorat";

/**
 * The version of the shell.
 *
 * Make sure this is a proper version number. Change this with the build (e.g. `78` will make the version `0.7.8`).
 *
 * For betas, add `-beta` to the end of the version number.
 */
const VERSION = "2.2.5-beta";
/**
 * The build of the shell.
 *
 * Make sure this is a proper build number. Change this with the version (e.g. `0.7.8` will make the build `78`).
 */
const BUILD = 225;

/**
 * If the configuration file needs to be reset if it is an older version when loaded in this version.
 */
const REQUIRE_CONFIG_RESET = false;
/**
 * If the shell is in beta or not. `true` if it is in beta, else, `false`.
 */
const IN_BETA = true;
/**
 * If the timebomb for the shell has been activated. `true` if the timebomb is activated, else, `false`.
 */
const TIMEBOMB_ACTIVATED = true;
/**
 * The expiry date of the shell. If `TIMEBOMB_ACTIVATED` **and** `IN_BETA` are both `true`, the shell will always check on startup if the current date has surpassed the expiry date.
 *
 * Change this every time a new executable is compiled.
 *
 * To change it, use the guide below:
 *
 * ```js
 * const EXPIRY_DATE = new Date(
 *   2023, // <-- The full year (4 digits)
 *   5,    // <-- The month (e.g. '0' will be January; '11' will be December)
 *   4     // <-- The date (1-31, depending on the month)
 * );
 * ```
 *
 * The expiry date is 90 days after the executable is compiled. This process is not automatic, so you must update this variable every time a new executable is compiled.
 *
 * To see the date in **90** days, [click here](https://www.google.com/search?q=Date+90+days+from+today).
 */
const EXPIRY_DATE = new Date(2025, 6, 8);

module.exports = {
  GLOBAL_NAME,
  SHORT_NAME,
  AUTHOR,
  VERSION,
  BUILD,
  REQUIRE_CONFIG_RESET,
  IN_BETA,
  TIMEBOMB_ACTIVATED,
  EXPIRY_DATE,
};
