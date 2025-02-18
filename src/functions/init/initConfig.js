const settings = require("../../data/settings.json");

const { BUILD } = require("../../variables/constants");

const ConfigManager = require("../../classes/ConfigManager");

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
    }),
  ];

  errorEncountered = actions.some((action) => !action);
  return errorEncountered;
};

module.exports = _initConfig;
