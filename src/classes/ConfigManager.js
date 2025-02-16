const fs = require("fs");
const os = require("os");
const path = require("path");

const { GLOBAL_NAME } = require("../variables/constants");

const Checks = require("./Checks");

/**
 * Class to manage the BubbleOS configuration file.
 *
 * Initialization is required to use this class. Methods in this class:
 * - `createConfig()`
 * - `deleteConfig()`
 * - `removeData(key)`
 * - `getConfig()`
 * - `addData(data)`
 * - `isConfig(path)`
 */
class ConfigManager {
  constructor() {
    this.configName = `${GLOBAL_NAME.toLowerCase()}-config.json`;
    this.configPath = path.join(os.homedir(), this.configName);
    this.configChk = new Checks(this.configPath);
  }

  /**
   * Creates the BubbleOS configuration file, if it does not exist yet.
   *
   * @returns `true` if the operation was successful, `false` if an error was encountered.
   */
  createConfig() {
    try {
      if (!this.configChk.doesExist()) {
        fs.writeFileSync(this.configPath, "{}");
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Deletes the BubbleOS configuration file.
   *
   * @returns `true` if the operation was successful, `false` if an error was encountered.
   */
  deleteConfig() {
    try {
      fs.rmSync(this.configPath, { recursive: true, force: true });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Removes a specific key from the BubbleOS configuration file.
   *
   * This is different from `deleteConfig()`, as this only deletes a specific
   * key in the data, rather than the entire configuration file itself.
   *
   * @param {string} key The key to delete.
   * @returns `true` if the operation was successful, `false` if an error was encountered.
   */
  removeData(key) {
    try {
      const contents = JSON.parse(
        fs.readFileSync(this.configPath, { flag: "r", encoding: "utf8" })
      );
      delete contents[key];
      fs.writeFileSync(this.configPath, JSON.stringify(contents));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gives the entire BubbleOS configuration file.
   *
   * @returns The data in the configuration file as an object, or `undefined` if an error was encountered.
   */
  getConfig() {
    try {
      const contents = fs.readFileSync(this.configPath, { flag: "r", encoding: "utf8" });
      return JSON.parse(contents);
    } catch {
      return undefined;
    }
  }

  /**
   * Adds data to the BubbleOS configuration file, overwriting the value.
   *
   * @param {{}} data The data as an object. For example, to save data with a key called `seen`, use `{ seen: true }`.
   * @returns `true` if the operation was successful, `false` if an error was encountered.
   */
  addData(data) {
    try {
      const contents = JSON.parse(
        fs.readFileSync(this.configPath, { flag: "r", encoding: "utf8" })
      );

      for (const param in data) {
        if (param === "history" && Array.isArray(data[param])) {
          contents[param] = data[param]; // Replace history array entirely
        } else if (Array.isArray(contents[param])) {
          contents[param] = contents[param].concat(data[param]); // Append to existing arrays
        } else {
          contents[param] = data[param]; // Add new data
        }
      }

      fs.writeFileSync(this.configPath, JSON.stringify(contents));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if the path is the BubbleOS configuration file.
   *
   * @param {string} chkPath The path to check.
   * @returns If the path is the BubbleOS configuration file.
   */
  isConfig(chkPath) {
    return this.configPath === chkPath;
  }
}

module.exports = ConfigManager;
