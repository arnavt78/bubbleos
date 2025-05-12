const chalk = require("chalk");

const {
  GLOBAL_NAME,
  IN_BETA,
  TIMEBOMB_ACTIVATED,
  EXPIRY_DATE,
} = require("../../variables/constants");

const _startupError = require("./startupError");
const _fatalError = require("../fatalError");

const Verbose = require("../../classes/Verbose");

/**
 * Checks if the timebomb has been activated.
 */
const _timebomb = () => {
  try {
    // Only if BubbleOS is in beta and the timebomb is activated will BubbleOS check the date
    if (IN_BETA && TIMEBOMB_ACTIVATED) {
      Verbose.custom("Getting current date...");
      const currentDate = new Date();

      Verbose.custom(
        `Expiry date: ${String(EXPIRY_DATE.getMonth() + 1).padStart(2, "0")}/${String(
          EXPIRY_DATE.getDate()
        ).padStart(2, "0")}/${EXPIRY_DATE.getFullYear()}. Current date: ${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(
          2,
          "0"
        )}/${currentDate.getFullYear()}`
      );

      // If the expiry date is past the current date, throw an error
      Verbose.custom("Checking if current date is past expiry date...");
      if (EXPIRY_DATE.getTime() < currentDate.getTime()) {
        Verbose.custom("Timebomb has been activated...");
        console.log(
          chalk.red(
            `This beta expired on ${String(EXPIRY_DATE.getMonth() + 1).padStart(2, "0")}/${String(
              EXPIRY_DATE.getDate()
            ).padStart(2, "0")}/${EXPIRY_DATE.getFullYear()}. Today is ${String(
              currentDate.getMonth() + 1
            ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(
              2,
              "0"
            )}/${currentDate.getFullYear()}.\nDownload the latest version at: https://github.com/viradex/bubbleos/releases\n`
          )
        );

        _startupError(
          `This beta build of ${GLOBAL_NAME} has expired. Please upgrade to a newer version of ${GLOBAL_NAME}.`,
          true,
          `${GLOBAL_NAME} was forcefully crashed due to the timebomb expiring`
        );
      }
    }
  } catch (err) {
    Verbose.fatalError();
    _fatalError(err);
  }
};

module.exports = _timebomb;
