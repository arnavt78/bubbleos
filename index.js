#!/usr/bin/env node

const chalk = require("chalk");
const { input } = require("@inquirer/prompts");

const { GLOBAL_NAME, SHORT_NAME, VERSION, BUILD } = require("./src/variables/constants");

const _intCmds = require("./src/functions/interpret");
const _detectArgs = require("./src/functions/detectArgs");

const exit = require("./src/commands/exit");

const Verbose = require("./src/classes/Verbose");
const PathUtil = require("./src/classes/PathUtil");

(async () => {
  // Check if terminal supports color
  // Verbose.custom("Checking terminal color support..."); // <- It would look weird if the terminal doesn't support color
  require("./src/functions/init/colorSupport")();

  // Initialize timebomb
  Verbose.custom("Detecting no timebomb argument...");
  if (!_detectArgs("timebomb")) require("./src/functions/init/timebomb")();

  // Initialize checks
  Verbose.custom("Detecting no checks argument...");
  if (!_detectArgs("checks")) require("./src/functions/init/startupChecks")();

  // Initialize startup arguments help
  Verbose.custom("Detecting startup arguments help argument...");
  if (_detectArgs("help")) {
    require("./src/functions/init/startupArgs")();

    Verbose.exitProcess();
    process.exit(0);
  }

  // Initialize version
  Verbose.custom("Detecting version argument...");
  if (_detectArgs("version")) {
    Verbose.custom("Showing version information...");
    console.log(`${GLOBAL_NAME}, v${VERSION} (build ${BUILD})\n`);

    Verbose.exitProcess();
    process.exit(0);
  }

  // Initialize pre-boot interpreter
  Verbose.custom("Starting pre-boot interpreter...");
  await require("./src/functions/init/preBootInt")();

  // Initialize executable arguments
  Verbose.custom("Initializing arguments...");
  require("./src/functions/init/initArgs");

  // Initialize elevation check
  Verbose.custom("Completing elevation check...");
  await require("./src/functions/init/checkElevation")();

  // Initialize update checker
  Verbose.custom("Initializing update checker...");
  await require("./src/functions/init/updateChecker")();

  // If the BubbleOS process is killed, exit gracefully
  // Works during the CLI
  process.once("SIGTERM", exit);
  process.once("SIGINT", exit);

  // CLI of BubbleOS
  Verbose.custom("Starting command interpreter...");
  while (true) {
    try {
      const command = await input({
        message: `${chalk.blueBright(PathUtil.caseSensitive(process.cwd()))} ${chalk.red("$")}`,
        theme: {
          prefix: chalk.bold.green(SHORT_NAME.toLowerCase()),
          style: {
            answer: (text) => chalk.reset(text),
          },
        },
      });

      Verbose.custom("Interpreting command...");
      await _intCmds(command?.trim());
    } catch ({ name }) {
      if (name === "ExitPromptError") {
        // If the user presses Ctrl+C, exit BubbleOS gracefully
        // Note this does not catch if a command is executing
        Verbose.custom("Detected Ctrl+C, exiting...");
        exit();
      }
    }
  }
})();
