const chalk = require("chalk");

const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

/**
 * Show the key/value pairs of an object in a user-friendly way.
 *
 * Usage:
 * ```js
 * _showKeyValue({
 *  address: "ABC",
 *  scopeid: 123
 * }, new Map([
 *  ["address", "IP Address"],
 *  ["scopeid", "Scope ID"],
 * ], "address"));
 * ```
 *
 * @param {object} obj The object to display.
 * @param {Map} userFriendlyMap A map that contains the user-friendly names for the keys.
 * @param {string} nameValue The key to use for the name of the object. Defaults to "name". Set to `false` to use a custom name.
 * @param {string} titleName The title to display for the object. Defaults to an empty string, and is only required to be entered if `nameValue` is `false`.
 */
const _showKeyValue = (obj, userFriendlyMap, nameValue = "name", titleName = "") => {
  const _makeUserFriendly = (key) => userFriendlyMap.get(key) || key;
  const _makeValueFriendly = (value) =>
    typeof value === "boolean" ? (value ? "Yes" : "No") : value;

  if (!obj || typeof obj !== "object") {
    throw new Error(`Invalid value passed, expected object but received ${typeof obj}`);
  }

  if (!Object.keys(obj).length) {
    Verbose.custom("No values found.");
    InfoMessages.error("No information was received.");
    return;
  }

  const title = !nameValue ? titleName : obj[nameValue];

  if (title) {
    Verbose.custom(`Displaying information ${title} and properties...`);
    console.log(chalk.red.bold(title));
  }

  let displayedValue = false;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "undefined" || value === null || value === "") continue;
    console.log(
      `${title ? "  " : ""}${_makeUserFriendly(key)}: ${chalk.bold(_makeValueFriendly(value))}`
    );
    displayedValue = true;
  }

  if (!displayedValue) {
    console.log(chalk.dim(`${title ? "  " : ""}No values found.`));
  }

  console.log(); // Add a newline between entries
};

module.exports = _showKeyValue;
