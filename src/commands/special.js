const chalk = require("chalk");
const os = require("os");
const { keyInPause } = require("readline-sync");
const { input } = require("@inquirer/prompts");

const { GLOBAL_NAME } = require("../variables/constants");

const _nonFatalError = require("../functions/nonFatalError");

const Verbose = require("../classes/Verbose");

const _delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * oops!
 */
const cConCon = (...args) => {
  try {
    console.log(`${chalk.bgGray.blue(` ${GLOBAL_NAME} `)}\n`);
    console.log(
      chalk.blueBright(
        "A fatal exception OE has occurred at 0028:C0034B03 in VXD VFAT(01) + 0000A3D7. The current application will be terminated.\n"
      )
    );
    console.log(chalk.blueBright(`*  Press any key to terminate ${GLOBAL_NAME}.`));
    console.log(
      chalk.blueBright(
        `*  Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.\n`
      )
    );
    keyInPause(chalk.blueBright(`Press any key to continue ${chalk.bold.grey("_")}`), {
      guide: false,
    });

    console.log();
    process.exit(1);
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

/**
 * Creeper? Aww man...
 */
const creeper = async (...args) => {
  try {
    const { username } = os.userInfo();
    const capitalUsername = username.trimStart().charAt(0).toUpperCase() + username.slice(1);

    const frames = [
      [
        chalk.gray("        .        "),
        chalk.gray("       ...       "),
        chalk.gray("        .        "),
      ],
      [
        chalk.yellow("       ░░░       "),
        chalk.yellow("      ░░░░░      "),
        chalk.yellow("       ░░░       "),
      ],
      [
        chalk.yellow("      ▒▒▒▒▒      "),
        chalk.yellow("     ▒▒▒▒▒▒▒     "),
        chalk.yellow("      ▒▒▒▒▒      "),
      ],
      [
        chalk.red("     ▓▓▓▓▓▓▓     "),
        chalk.red("    ▓▓▓▓▓▓▓▓▓    "),
        chalk.red("     ▓▓▓▓▓▓▓     "),
      ],
      [
        chalk.red("    █████████    "),
        chalk.red("   ███████████   "),
        chalk.red("    █████████    "),
      ],
      [
        chalk.red("  █████████████  "),
        chalk.red(" ███████████████ "),
        chalk.red("  █████████████  "),
      ],
      [
        chalk.yellow("   ███████████   "),
        chalk.yellow("    █████████    "),
        chalk.yellow("     ███████     "),
      ],
      [
        chalk.yellow("     ▓▓▓▓▓▓▓     "),
        chalk.yellow("      ▓▓▓▓▓      "),
        chalk.yellow("       ▓▓▓       "),
      ],
      [
        chalk.gray("      ▒▒▒▒▒      "),
        chalk.gray("       ▒▒▒       "),
        chalk.gray("        ▒        "),
      ],
    ];

    console.log("Creeper? Aww, man...");
    await _delay(1000);

    for (const frame of frames) {
      process.stdout.write("\x1bc");
      console.log(frame.join("\n"));
      await _delay(200);
    }

    process.stdout.write("\x1bc");
    console.log(chalk.whiteBright.bold(`${capitalUsername} was blown up by Creeper\n`));

    await _delay(1000);
    process.exit(1);
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

/**
 * This is a very historically accurate representation of the Apple Newton
 * Personal Digital Assistant. Trust, bro.
 */
const newton = async (...args) => {
  try {
    console.log(chalk.underline.bold("Apple Newton Personal Digital Assistant"));

    const notes = await input({
      message: "Enter your notes:",
      theme: {
        style: {
          answer: (text) => chalk.strikethrough(text),
        },
      },
    });

    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let historicallyAccurate = "";

    // Simpsons reference? :P
    if (notes.toLowerCase().trim() === "beat up martin") {
      console.log("\nEat up Martha\n");
      return;
    }

    for (let i = 0; i < notes.length; i++) {
      if (Math.random() > 0.7) {
        // 30% chance to replace the character with something random
        historicallyAccurate += characters.charAt(Math.floor(Math.random() * characters.length));
      } else {
        historicallyAccurate += notes.charAt(i);
      }
    }

    console.log("\n" + historicallyAccurate + "\n");
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

/**
 * I had way too much fun coding this :D
 */
const error = (...args) => {
  try {
    const errorMsgs = [
      "This program has performed an illegal operation and will be shut down.",
      "404 Not Found",
      "Segmentation Fault (core dumped)",
      "Kernel panic - not syncing",
      "This application is not responding. The program may respond again if you wait.",
      "Not recognized as an internal or external command, operable program or batch file.",
      "Not ready reading drive A\nAbort, Retry, Fail?",
      "Keyboard not responding, press any key to continue...",
      "Error: The operation completed successfully.",
      "Error at line 295 on your 78 line file.",
    ];

    console.log(chalk.red.bold(errorMsgs[Math.floor(Math.random() * errorMsgs.length)]) + "\n");
  } catch (err) {
    console.log(`Looks like you found our very special error :)\n`);

    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = { cConCon, creeper, newton, error };
