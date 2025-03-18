const https = require("https");
const chalk = require("chalk");
const boxen = require("boxen");
const readline = require("readline");

const { GLOBAL_NAME, BUILD, RELEASE_CANDIDATE } = require("../../variables/constants");

const HTTP_CODES = require("../../data/httpCodes.json");

const _fatalError = require("../fatalError");

const Verbose = require("../../classes/Verbose");
const InfoMessages = require("../../classes/InfoMessages");
const SettingManager = require("../../classes/SettingManager");
const ConfigManager = require("../../classes/ConfigManager");

/**
 * Format date from GitHub format of `YYYY-MM-DD` and time.
 *
 * @param {string} dateString Original date string.
 * @returns Modified date string in the form of MM/DD/YYYY
 */
const _formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(
    2,
    "0"
  )}/${date.getFullYear()}`;
};

/**
 * Gets the next Sunday date at midnight for the update checker.
 *
 * @returns The date of next Sunday at midnight in ISO format.
 */
const _getNextSundayAtMidnight = () => {
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay())); // Next Sunday
  nextSunday.setHours(0, 0, 0, 0); // Set to 12:00 AM in local time

  // Convert to local time before storing as ISO string
  const localOffset = nextSunday.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localMidnight = new Date(nextSunday.getTime() - localOffset); // Adjust for local time zone

  return localMidnight.toISOString();
};

const _updateChecker = () => {
  try {
    Verbose.custom("Getting update checker preference and URL...");
    const preference = new SettingManager().checkSetting("updateChecker");
    const url =
      preference === "prerelease"
        ? "https://api.github.com/repos/arnavt78/bubbleos/releases"
        : preference === "release"
        ? "https://api.github.com/repos/arnavt78/bubbleos/releases/latest"
        : "";

    const options = {
      headers: {
        "User-Agent": "node.js", // Required by GitHub API
      },
    };

    Verbose.custom("Getting time for next update check...");
    const config = new ConfigManager();
    const lastUpdateDate = config.getConfig()?.nextUpdateCheck;
    const now = new Date();

    if (!lastUpdateDate || now >= new Date(lastUpdateDate)) {
      Verbose.custom("Setting next update check to next Sunday at midnight...");
      config.addData({ nextUpdateCheck: _getNextSundayAtMidnight() });

      if (!url) {
        Verbose.custom("Updates not requested, exiting...");
        return Promise.resolve();
      }

      // Disable keyboard input
      readline.emitKeypressEvents(process.stdin);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }

      process.stdout.write("\r");
      process.stdout.write(chalk.blue("Checking for updates... "));
      process.stdout.write("\x1b[25G");

      return new Promise((resolve) => {
        https
          .get(url, options, (res) => {
            let data = "";

            if (res.statusCode !== 200) {
              Verbose.custom("Error while getting response.");
              InfoMessages.error(
                `Failed to get new releases. Response: ${res.statusCode} (${
                  HTTP_CODES[res.statusCode] ?? "N/A"
                })`
              );

              res.destroy();
              resolve();
            }

            res.on("data", (chunk) => {
              Verbose.custom("Fetched chunk, adding to data...");
              data += chunk;
            });

            res.on("end", () => {
              Verbose.custom("Parsing data...");
              const parsedData = JSON.parse(data);
              const release = Array.isArray(parsedData) ? parsedData[0] : parsedData;

              Verbose.custom("Obtaining release information...");
              const releaseInfo = {
                url: release?.html_url,
                tag: release?.tag_name,
                name: release?.name,
                published: release?.published_at,
              };

              // Extract build and release candidate
              const match = releaseInfo.name.match(/Build (\d+)(?: Release Candidate (\d+))?/);
              const build = match ? Number(match[1]) : null;
              const releaseCandidate = match && match[2] ? Number(match[2]) : 0; // Default RC to 0 if not found

              const isOutdated =
                typeof build !== "undefined" &&
                (BUILD < build || // A higher fetched build is always outdated
                  (BUILD === build &&
                    RELEASE_CANDIDATE > 0 &&
                    RELEASE_CANDIDATE < releaseCandidate) || // Fetched RC is greater than nonzero current RC
                  (BUILD === build && RELEASE_CANDIDATE > releaseCandidate) || // Installed RC is newer, no downgrade
                  (BUILD === build && releaseCandidate === 0)); // Fetched RC is 0, meaning a stable release, outdated

              process.stdout.write(chalk.green.bold("DONE!"));
              process.stdout.write("\n\n");

              // Re-enable keyboard input
              if (process.stdin.isTTY) {
                process.stdin.setRawMode(false);
              }

              // If current build is newer than fetched build, ignore
              if (!isOutdated) {
                Verbose.custom(
                  "Build information fetched detected to be older than current build, exiting..."
                );
                resolve();
                return;
              }

              Verbose.custom("Outputting message...");
              const message = `A new ${GLOBAL_NAME} version, ${chalk.yellow(
                releaseInfo.tag
              )} (${chalk.magenta(releaseInfo.name)}), was released on ${chalk.green(
                _formatDate(releaseInfo.published)
              )}!\nDownload at: ${chalk.cyan.underline(releaseInfo.url)}`;

              console.log(
                boxen(message, {
                  padding: 1,
                  margin: 0,
                  borderStyle: "bold",
                  borderColor: "blue",
                  title: chalk.blue.bold("New Version Released!"),
                  titleAlignment: "center",
                })
              );

              console.log();
              resolve();
            });
          })
          .on("error", () => {
            process.stdout.write(chalk.red.bold("Connection Error"));
            process.stdout.write("\n");

            // Re-enable keyboard input on error
            if (process.stdin.isTTY) {
              process.stdin.setRawMode(false);
            }

            console.log(
              chalk.red.dim(
                `Unable to connect to server (check your internet connection). ${GLOBAL_NAME} will attempt to check for updates next Sunday.\n`
              )
            );
            Verbose.custom("An error occurred.");
            resolve();
          });
      });
    } else {
      Verbose.custom("Not time to check for updates yet.");
      return Promise.resolve();
    }
  } catch (err) {
    _fatalError(err);
  }
};

module.exports = _updateChecker;
