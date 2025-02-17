const settings = require("../../data/settings.json");

const ConfigManager = require("../../classes/ConfigManager");

const _initConfig = () => {
  const config = new ConfigManager();

  // Reset config file
  config.deleteConfig();
  config.createConfig();

  // Add default settings
  config.addData({
    settings: Object.fromEntries(
      Object.entries(settings).map(([key, setting]) => [
        key,
        {
          displayName: setting.displayName,
          current: setting.default,
        },
      ])
    ),
  });

  // Add history key to prevent config corruption error
  config.addData({ history: [] });
};

module.exports = _initConfig;
