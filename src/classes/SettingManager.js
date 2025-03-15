const path = require("path");

const ConfigManager = require("./ConfigManager");
const PathUtil = require("./PathUtil");

/**
 * Manages settings stored in the BubbleOS configuration file.
 *
 * Requires initialization to use the class.
 */
class SettingManager {
  #configMgr;
  constructor() {
    this.#configMgr = new ConfigManager();
  }

  /**
   * Check the value of a specified setting from the configuration file.
   *
   * @param {string} setting The name of the setting, as defined in `settings.json`.
   * @returns The value of the setting, or `undefined` if it does not exist.
   */
  checkSetting(setting) {
    return this.#configMgr.getConfig()?.settings?.[setting]?.current?.value;
  }

  /**
   * Converts the path to either a full path or the basename.
   *
   * Should be used for success and error messages.
   *
   * @param {string} argPath The path to check.
   * @returns The full or basename path, depending on the setting.
   */
  fullOrBase(argPath) {
    if (this.checkSetting("fullPathOrBase") === "base") {
      const basename = path.basename(argPath);
      return basename || (argPath === "/" || argPath.endsWith(path.sep) ? argPath : "");
    } else {
      return PathUtil.convertAbsolute(argPath);
    }
  }

  /**
   * Checks whether or not BubbleOS should show the version on startup.
   *
   * @returns `true` if the version should be shown, else, `false`.
   */
  showVersion() {
    return this.checkSetting("showVersionOnStart") != false;
  }
}

module.exports = SettingManager;
