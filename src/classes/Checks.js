const fs = require("fs");
const { isText } = require("istextorbinary");

/**
 * Validate multiple aspects of BubbleOS.
 */
class Checks {
  /**
   * Validate multiple aspects of BubbleOS.
   *
   * @param {string} param The parameter to be used in the validations.
   */
  constructor(param) {
    this.param = param;
  }

  /**
   * Returns `true` if the parameter is `undefined`, else, returns `false`.
   */
  paramUndefined() {
    if (Array.isArray(this.param)) return this.param.length === 0;
    return (
      typeof this.param === "undefined" ||
      (typeof this.param === "string" && this.param.trim() === "")
    );
  }

  /**
   * Returns `true` if the path exists, else, returns `false`.
   */
  doesExist() {
    try {
      fs.statSync(this.param);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Returns `true` if the file is a text file, else, returns `false` (also returns `false` if the path does not exist or is a directory).
   */
  validEncoding() {
    if (!this.doesExist() || fs.statSync(this.param).isDirectory()) return false;
    return isText(this.param, fs.readFileSync(this.param, { flag: "r" }));
  }

  /**
   * Returns `true` if the path is a directory, else, returns `false` (also returns `false` if the path does not exist).
   */
  validateType() {
    if (!this.doesExist()) return false;
    return fs.statSync(this.param).isDirectory();
  }

  /**
   * Returns `true` if the path is a UNC path, else, returns `false` (also returns `false` if the OS is not Windows).
   */
  pathUNC() {
    if (process.platform !== "win32") return false;
    if (typeof this.param !== "string")
      throw new TypeError(`Parameter must be of type string, received ${typeof this.param}`);
    return /^[/\\]{2}[^/\\]+[/\\]+[^/\\]+|^[/\\]{2}\?[\\/][a-zA-Z]:[\\/]/.test(this.param);
  }
}

module.exports = Checks;
