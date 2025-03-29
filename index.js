#!/usr/bin/env node

const chalk = require("chalk");
const { question } = require("readline-sync");

const { GLOBAL_NAME, SHORT_NAME, VERSION, BUILD } = require("./src/variables/constants");

const _intCmds = require("./src/functions/interpret");
const _detectArgs = require("./src/functions/detectArgs");

const Verbose = require("./src/classes/Verbose");
const PathUtil = require("./src/classes/PathUtil");

(async () => {
  // Check if terminal supports color
  Verbose.custom("Checking terminal color support...");
  require("./src/functions/init/colorSupport")();

  // Detect if Node.js version is supported
  Verbose.custom("Checking Node.js version...");
  require("./src/functions/init/detectNodeVer")();

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
    console.log(`${GLOBAL_NAME}, v${VERSION} (Build ${BUILD})\n`);

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

  // TODO Change the prompt to use built-in readline module,
  // to allow for Ctrl+C handling and command history cycling
  // on all OSes. When doing so, there are a few bugs:
  //  - All commands must be converted into async
  //  - All stdin such as in mkfile will need to be dealt with
  //    as it acts like the CLI

  // CLI of BubbleOS
  Verbose.custom("Starting command interpreter...");
  while (true) {
    const command = question(
      `${chalk.bold.green(SHORT_NAME.toLowerCase())} ${chalk.blueBright(
        PathUtil.caseSensitive(process.cwd())
      )} ${chalk.red("$")} `
    );

    Verbose.custom("Interpreting command...");
    await _intCmds(command?.trim());
  }
})();
