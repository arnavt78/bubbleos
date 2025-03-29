const chalk = require("chalk");

const { GLOBAL_NAME } = require("../../variables/constants");

const _fatalError = require("../fatalError");
const _startupError = require("./startupError");

const Verbose = require("../../classes/Verbose");

/**
 * Ensure the Node.js version is supported.
 */
const _detectNodeVer = () => {
  try {
    const REQUIRED_NODE_VERSION = 22;

    if (parseInt(process.versions.node.split(".")) < REQUIRED_NODE_VERSION) {
      _startupError(
        `${GLOBAL_NAME} detected an invalid version of Node.js. At least Node.js version ${REQUIRED_NODE_VERSION} is required for ${GLOBAL_NAME} to run.`,
        true,
        `${GLOBAL_NAME} detected an invalid Node.js version and forcefully crashed`
      );
    }
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = _detectNodeVer;
