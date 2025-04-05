const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const { editor } = require("@inquirer/prompts");

const _nonFatalError = require("../../functions/nonFatalError");
const _promptForYN = require("../../functions/promptForYN");
const _exit = require("../../functions/exit");

const Errors = require("../../classes/Errors");
const Checks = require("../../classes/Checks");
const InfoMessages = require("../../classes/InfoMessages");
const Verbose = require("../../classes/Verbose");
const PathUtil = require("../../classes/PathUtil");
const SettingManager = require("../../classes/SettingManager");

const editfile = async (file, ...args) => {
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
      Errors.enterParameter("a file", "editfile test.txt");
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
    }

    InfoMessages.info("Save the file once finished editing, and then close the window.");

    Verbose.custom("Reading file contents...");
    const contents = fs.readFileSync(file, { encoding: "utf-8", flag: "r" });

    Verbose.custom("Requesting new file contents and opening temporary file editing software...");
    const newContents = await editor({
      message: `Editing ${chalk.italic(path.basename(file))}:`,
      default: contents,
    });

    console.log();

    Verbose.custom("Overwriting file contents...");
    fs.writeFileSync(file, newContents, "utf-8");

    if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
      InfoMessages.success(`Successfully edited the file ${chalk.bold(showFile)}.`);
    else console.log();
  } catch (err) {
    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (err.code === "ENOENT") {
      // If the parent directory does not exist
      Verbose.chkExists(file);
      Errors.doesNotExist("file", showFile);
    } else if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("read/write the file", showFile);
    } else if (err.code === "UNKNOWN") {
      Verbose.unknownError();
      Errors.unknown();
    } else {
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = editfile;
