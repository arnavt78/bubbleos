const path = require("path");
const fs = require("fs");

/**
 * Retrieves the actual case-sensitive path on Windows by traversing path segments.
 * On Linux/macOS, it simply resolves the absolute path.
 *
 * @param {string} inputPath The input path to correct.
 * @returns {string} The correctly cased path or the fallback value.
 */
const _caseSensitivePath = (inputPath) => {
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
    // Make this a verbose message ↓
    // InfoMessages.error("An error occurred while trying to make the path case-sensitive.");
    return inputPath;
  }
};

module.exports = _caseSensitivePath;
