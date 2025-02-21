const settings = require("../../data/settings.json");

const { BUILD, RELEASE_CANDIDATE } = require("../../variables/constants");

const ConfigManager = require("../../classes/ConfigManager");

/**
 * Gets the last Sunday date at midnight for the update checker.
 *
 * @returns The date of last Sunday at midnight in ISO format.
 */
const _getLastSundayAtMidnight = () => {
  const now = new Date();
  const lastSunday = new Date(now);

  // Set the date to the last Sunday
  lastSunday.setDate(now.getDate() - now.getDay());
  lastSunday.setHours(0, 0, 0, 0);

  // Convert to local time before storing as ISO string
  const localOffset = lastSunday.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localMidnight = new Date(lastSunday.getTime() - localOffset); // Adjust for local time zone

  return localMidnight.toISOString();
};

/**
 * Initialize the BubbleOS configuration for a reset.
 *
 * @returns `true` if an error was encountered, else, `false`.
 */
const _initConfig = () => {
  const config = new ConfigManager();
  let errorEncountered = false;

  const actions = [
    config.deleteConfig(),
    config.createConfig(),
    config.addData({
      settings: Object.fromEntries(
        Object.entries(settings).map(([key, setting]) => [
          key,
          { displayName: setting.displayName, current: setting.default },
        ])
      ),
      history: [],
      build: BUILD,
      releaseCandidate: RELEASE_CANDIDATE,
      nextUpdateCheck: _getLastSundayAtMidnight(),
    }),
  ];

  errorEncountered = actions.some((action) => !action);
  return errorEncountered;
};

module.exports = _initConfig;
