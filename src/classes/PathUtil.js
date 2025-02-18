const path = require("path");
const fs = require("fs");
const os = require("os");

/**
 * A utility class for handling paths.
 *
 * Contains the following methods:
 * - `homeDir`
 * - `caseSensitivePath`
 * - `convertAbsolute`
 * - `parseQuotes` (this doesn't have to be used with paths!)
 */
class PathUtil {
  /**
   * Replaces tildes (`~`) with the home directory on Linux/macOS.
   *
   * @param {string} inputPath The path to convert.
   * @returns The converted path.
   */
  static homeDir(inputPath) {
    if (os.platform() === "win32") return inputPath;
    else return inputPath.replace("~", os.homedir());
  }

  /**
   * Retrieves the actual case-sensitive path on Windows by traversing path segments.
   * On Linux/macOS, it simply resolves the absolute path.
   *
   * @param {string} inputPath The input path to correct.
   * @returns {string} The correctly cased path or the fallback value.
   */
  static caseSensitive(inputPath) {
    if (typeof inputPath !== "string") return;
    if (process.platform !== "win32") return path.resolve(inputPath);

    try {
      const resolvedPath = path.resolve(inputPath);
      const pathSegments = resolvedPath.split(path.sep);
      let actualPath = pathSegments[0].toUpperCase() + (pathSegments[0].endsWith(":") ? "\\" : "");

      for (let i = 1; i < pathSegments.length; i++) {
        const items = fs.readdirSync(actualPath); // Read current directory
        const correctSegment = items.find(
          (item) => item.toLowerCase() === pathSegments[i].toLowerCase()
        );

        actualPath = path.join(actualPath, correctSegment || pathSegments[i]); // Join found or original segment
        if (!correctSegment) break; // Exit loop if segment is not found
      }

      return actualPath;
    } catch {
      // If an error occurred, return the original path
      return inputPath;
    }
  }

  /**
   * Convert a path to an absolute path, unless the path is already an absolute path.
   *
   * Example of a relative path: `./test.txt`
   *
   * Example of an absolute path: `D:\a\directory\with\a\file\test.txt`
   *
   * @param {string} inputPath The absolute/relative path to convert.
   * @returns A string of the new absolute path.
   */
  static convertAbsolute = (inputPath) => {
    try {
      if (typeof inputPath === "undefined" || inputPath === "") return;

      // As Windows supports backslashes, but Linux only supports forward-slashes
      // So, check for the OS and change their slashes to their respective OS
      let replace = { before: "\\", after: "/" };
      if (process.platform === "win32") {
        replace.before = "/";
        replace.after = "\\";
      }

      inputPath = inputPath.replaceAll(replace.before, replace.after);
      let pathName = "";

      // If the path is not already an absolute path, convert it to one
      if (!path.isAbsolute(inputPath)) {
        pathName = `${process.cwd()}${replace.after}${inputPath}`;
      } else {
        pathName = inputPath;
      }

      // Replace all slashes with their respective OS slashes, and any double-slashes to single slashes
      return pathName
        .replaceAll(replace.before, replace.after)
        .replaceAll("\\\\", "\\")
        .replaceAll("//", "/");
    } catch (err) {
      // If an error occurred, throw an error
      throw new Error(err);
    }
  };

  /**
   * Parse double-quote paths and arguments to allow
   * the user to specify spaces when needed.
   *
   * @param {string[]} arr The array to parse the double-quotes out of.
   * @returns The array with the parsed elements, including removing the double-quotes.
   */
  static parseQuotes = (arr) => {
    try {
      const str = arr?.join(" ");
      const matches = str?.match(/"([^"]*)"(?:[^"]*"([^"]*)")?/);

      if (str?.trim() === "" || typeof str === "undefined") return [];

      if (matches && matches.length === 3) {
        const quotesText = matches.filter(Boolean);
        quotesText.shift();

        return quotesText;
      } else return str?.split(" ");
    } catch (err) {
      // If an error occurred, throw an error
      throw new Error(err);
    }
  };

  /**
   * Combines all functions in `PathUtil` into one function.
   *
   * **If using `parseQuotes`, pass an array of strings into `inputPath`, otherwise, provide a string.**
   *
   * Contains the following options:
   * - `homeDir`: Replace tildes (`~`) with the home directory on Linux/macOS.
   * - `caseSensitive`: Retrieves the actual case-sensitive path on Windows by traversing path segments.
   * - `convertAbsolute`: Convert a path to an absolute path, unless the path is already an absolute path.
   * - `parseQuotes`: Parse double-quote paths and arguments to allow the user to specify spaces when needed.
   *
   * @param {string | string[]} inputPath The input path.
   * @param {{ homeDir: boolean, caseSensitive: boolean, convertAbsolute: boolean, parseQuotes: boolean }} options The options to use.
   * @returns The converted path.
   */
  static all(
    inputPath,
    options = { homeDir: true, caseSensitive: true, convertAbsolute: true, parseQuotes: true }
  ) {
    options = {
      homeDir: true,
      caseSensitive: true,
      convertAbsolute: true,
      parseQuotes: true,
      ...options,
    };

    if (options.parseQuotes) inputPath = PathUtil.parseQuotes(inputPath)[0];
    if (typeof inputPath === "undefined") return inputPath;

    if (options.homeDir) inputPath = PathUtil.homeDir(inputPath);
    if (options.convertAbsolute) inputPath = PathUtil.convertAbsolute(inputPath);
    if (options.caseSensitive) inputPath = PathUtil.caseSensitive(inputPath);

    return inputPath;
  }
}

module.exports = PathUtil;
