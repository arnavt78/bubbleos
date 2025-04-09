const _fatalError = require("./fatalError");

/**
 * Custom convert size function including size labels.
 *
 * @param {number} bytes The size in bytes to convert.
 * @param {number} decimals The number of decimal places to round to. Defaults to `2`.
 * @returns The best size and unit.
 */
const _convertSize = (bytes, decimals = 2) => {
  try {
    if (bytes === 0) return { size: 0, unit: "bytes" };

    const sizes = ["bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals));

    return { size, unit: sizes[i] };
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _convertSize;
