const isElevated = require("is-elevated");

const { GLOBAL_NAME } = require("../../variables/constants");

const _detectArgs = require("../detectArgs");

const InfoMessages = require("../../classes/InfoMessages");

/**
 * Check if BubbleOS is running as sudo/administrator.
 */
const checkElevation = async () => {
  if ((await isElevated()) && !_detectArgs("warnings"))
    InfoMessages.warning(
      `${GLOBAL_NAME} is running with elevated privileges. Use commands with caution.`
    );
};

module.exports = checkElevation;
