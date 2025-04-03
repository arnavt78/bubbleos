const fs = require("fs");
const chalk = require("chalk");
const qrgenerator = require("qrcode");
const path = require("path");
const { input } = require("@inquirer/prompts");

const _nonFatalError = require("../../functions/nonFatalError");
const _promptForYN = require("../../functions/promptForYN");
const _exit = require("../../functions/exit");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const InfoMessages = require("../../classes/InfoMessages");
const Verbose = require("../../classes/Verbose");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

/**
 *
 * @param {string} file
 * @param  {...string} args
 */
const qrcode = async (file, ...args) => {
  try {
    // Converts path to an absolute path and corrects
    // casing on Windows, and resolves spaces
    Verbose.pathAbsolute(file);
    Verbose.parseQuotes();
    file = PathUtil.all([file, ...args]);

    Verbose.initChecker();
    const fileChk = new Checks(file);

    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (fileChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a file", "qrcode image.png");
      return;
    }

    if (fileChk.doesExist()) {
      Verbose.promptUser();
      if (
        _promptForYN(
          `The file, '${chalk.italic(
            path.basename(file)
          )}', already exists. Would you like to delete it?`
        )
      ) {
        try {
          Verbose.custom("Deleting the file...");
          fs.rmSync(file, { recursive: true, force: true });
          InfoMessages.success(`Successfully deleted ${chalk.bold(showFile)}.`);
        } catch (err) {
          if (err.code === "EPERM" || err.code === "EACCES") {
            Verbose.permError();
            Errors.noPermissions("delete the file", showFile);
          } else if (err.code === "EBUSY") {
            Verbose.inUseError();
            Errors.inUse("file", showFile);
          }

          InfoMessages.error(`Could not delete ${chalk.bold(showFile)}.`);
          return;
        }
      } else {
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }
    }

    if (fileChk.pathUNC()) {
      Verbose.chkUNC();
      Errors.invalidUNCPath();
      return;
    }

    // Automatically convert filename to end with .png
    Verbose.custom("Converting file to .png file...");
    file = file.endsWith(".png") ? file : `${file}.png`;

    // Prompt for the URL
    Verbose.custom("Prompting user for URL...");
    const response = await input({
      message: "Enter the URL for the QR code:",
      required: true,
      validate: (input) => {
        return (
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[^?\s]*)?(\?[^#\s]*)?(#[^\s]*)?$/.test(
            input
          ) || "Please enter a valid URL"
        );
      },
    });

    Verbose.custom("Showing QR code in terminal...");
    const qrTerminal = await qrgenerator.toString(response, {
      type: "terminal",
      small: true,
    });

    console.log(`\n${qrTerminal}`);

    Verbose.custom("Generating QR code and saving to file...");
    await qrgenerator.toFile(file, response);

    if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
      InfoMessages.success(`Successfully made the file ${chalk.bold(showFile)}.`);
    else console.log();
  } catch (err) {
    if (err.name === "ExitPromptError") {
      // If the user presses Ctrl+C, exit BubbleOS gracefully
      Verbose.custom("Detected Ctrl+C, exiting...");
      _exit();
    } else {
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = qrcode;
