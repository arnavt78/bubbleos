const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { input } = require("@inquirer/prompts");

const _fatalError = require("../functions/fatalError");
const _exit = require("../functions/exit");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const Verbose = require("../classes/Verbose");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");

/**
 * Escape all special characters in RegExp.
 *
 * This will add the ignore character (`\`) before
 * all special characters (ironically using RegExp)!
 *
 * See [this website](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping)
 * for more information.
 *
 * @param {string} str The string to replace all special RegExp characters with.
 * @returns The string will all special characters ignored.
 */
const escapeRegExp = (str) => str.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Find a word or phrase in a file.
 *
 * This function will find all occurrences in a file
 * and show them in multiple ways to the standard
 * output. For example, it will show the number of
 * occurrences found, the character position since the
 * start of the file for each occurrence, and a visual
 * occurrences text will the occurrences highlighted.
 *
 * Available arguments:
 * - `-n`: Show the number of occurrences.
 * - `-p`: Show the character occurrences.
 * - `-v`: Show the visual occurrences.
 *
 * _Note: If no arguments are passed that are either `-n`, `-p` or `-v`, it will show all of them._
 *
 * @param {string} file A path to the file to search in. Please note directories are not valid.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const fif = async (file, ...args) => {
  try {
    Verbose.pathAbsolute();
    Verbose.parseQuotes();
    file = PathUtil.all([file, ...args]);

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    Verbose.initArgs();
    const numOccur = args.includes("-n");
    const placeOccur = args.includes("-p");
    const visualOccur = args.includes("-v");
    const all = !numOccur && !placeOccur && !visualOccur;

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("the file", "fif test.txt");
      return;
    }

    if (!fileChk.doesExist()) {
      Verbose.chkExists(file);
      Errors.doesNotExist("file", showFile);
      return;
    } else if (fileChk.validateType()) {
      Verbose.chkType(file, "file");
      Errors.expectedFile(showFile);
      return;
    } else if (fileChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    } else if (!fileChk.validEncoding()) {
      Verbose.chkEncoding();
      Errors.invalidEncoding("plain text");
      return;
    }

    // Get file contents
    Verbose.custom(`Getting file contents of '${file}'...`);
    const contents = fs.readFileSync(file, { encoding: "utf-8", flag: "r" });

    // Ask user for the phrase
    Verbose.custom("Prompting user for phrase to find...");
    const toFind = await input({
      message: `Enter the phrase to find in ${chalk.italic(path.basename(file))}:`,
      required: true,
      theme: {
        style: {
          answer: (text) => chalk.reset(text),
          error: () => chalk.red("You must enter a phrase."),
        },
      },
    });

    console.log();

    // The RegExp code will match against the contents,
    // and if 'null' is returned, it'll default to [].
    // Otherwise, it will return an array, of which only the length is required.
    // However, if the length is undefined, it will be -1.
    Verbose.custom("Getting occurrences of phrase...");
    const occurrences = contents.match(new RegExp(escapeRegExp(toFind), "g") || [])?.length ?? -1;

    // If there are no occurrences
    Verbose.custom("Checking if there are no occurrences...");
    if (occurrences === -1) {
      Verbose.custom("No occurrences detected, aborting process...");
      console.log(
        chalk.yellow(
          `No occurrences were found for the phrase ${chalk.bold.italic(`'${toFind}'`)}.\n`
        )
      );
      return;
    }

    // If at least the number, place, or all was requested, show the subheading
    if (numOccur || placeOccur || all) console.log(chalk.red.bold.underline(`Occurrences`));

    // Number of occurrences
    if (numOccur || all) {
      Verbose.custom("Printing number of occurrences...");
      console.log(`Number of occurrences: ${chalk.italic(occurrences)}\n`);
    }

    // Character occurrence location (does not show up by default)
    if (placeOccur) {
      console.log("Occurrence location since start of file:");

      // Matches each phrase in the content and spreads it into an array
      Verbose.custom("Matching phrases and storing matched phrases...");
      const charNum = [...contents.matchAll(new RegExp(escapeRegExp(toFind), "g"))];

      // Loop through all character occurrences and output them
      Verbose.custom("Looping through all occurrences and printing...");
      charNum.forEach((val, idx) => {
        console.log(`#${idx + 1}: ${chalk.bold.italic(val.index + 1 ?? "N/A")}`);
      });

      console.log();
    }

    // Visible occurrences (file contents will highlighted occurrences)
    if (visualOccur || all) {
      console.log(chalk.red.bold.underline(`Visual occurrences\n`));

      // Replace all occurrences with a highlighted version
      Verbose.custom("Finding all occurrences and highlighting...");
      console.log(
        contents.replaceAll(new RegExp(escapeRegExp(toFind), "g"), chalk.bgYellow.black(toFind))
      );
      console.log();
    }
  } catch (err) {
    if (err.name === "ExitPromptError") {
      // If the user presses Ctrl+C, exit BubbleOS gracefully
      Verbose.custom("Detected Ctrl+C, exiting...");
      _exit(false, false);
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = fif;
