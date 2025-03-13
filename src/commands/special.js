const chalk = require("chalk");
const os = require("os");
const { keyInPause } = require("readline-sync");

const { GLOBAL_NAME } = require("../variables/constants");

const _nonFatalError = require("../functions/nonFatalError");

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
      [chalk.whiteBright.bold(`${capitalUsername} was blown up by Creeper`), "", ""],
    ];

    console.log("Creeper? Aww, man...");
    await _delay(1000);

    for (const frame of frames) {
      process.stdout.write("\x1bc");
      console.log(frame.join("\n"));
      await _delay(200);
    }

    await _delay(1000);
    process.exit(1);
  } catch (err) {
    _nonFatalError(err);
  }
};

module.exports = { cConCon, creeper };
