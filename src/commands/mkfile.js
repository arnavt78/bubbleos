const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const { input } = require("@inquirer/prompts");

const _nonFatalError = require("../functions/nonFatalError");
const _promptForYN = require("../functions/promptForYN");
const _exit = require("../functions/exit");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");

/**
 * Get file contents from the user and create the file.
 *
 * @param {string} file The name of the file to create.
 * @param {boolean} silent Whether or not success messages should be shown.
 */
const _fileContents = async (file) => {
  try {
    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    console.log(
      `Add the content of the new file. Type '${chalk.italic(
        "!SAVE"
      )}' to save changes, '${chalk.italic("!CANCEL")}' to discard, or '${chalk.italic(
        "!EDIT"
      )}' to modify previous input:\n`
    );

    // Collect new content line by line
    let contents = [];
    while (true) {
      Verbose.custom("Asking for line input...");
      const line = await input({
        message: "",
        theme: {
          prefix: chalk.bold(">"),
          style: {
            answer: (text) => chalk.reset(text),
          },
        },
      });

      if (line.toUpperCase() === "!SAVE") {
        // Save the new content to the file, ensuring no trailing newline
        Verbose.custom("Saving file with provided file contents...");
        fs.writeFileSync(file, contents.join("\n"), "utf8");

        // If the user requested output, show a success message, else, show a newline
        if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
          InfoMessages.success(`Successfully made the file ${chalk.bold(showFile)}.`);
        else console.log();
        return;
      } else if (line.toUpperCase() === "!CANCEL") {
        Verbose.custom("Discarding changes and removing file...");
        console.log(chalk.yellow("Edits discarded and process aborted."));
        return;
      } else if (line.toUpperCase() === "!EDIT") {
        if (contents.length === 0) {
          console.log(chalk.yellow("No previous input to edit.\n"));
        } else {
          Verbose.custom("Asking for the line to edit...");
          const lineNumber = await input({
            message: chalk.blue("Choose a line number to edit (1-" + contents.length + "): "),
            validate: (value) => {
              const num = parseInt(value, 10);
              return num >= 1 && num <= contents.length;
            },
            theme: {
              style: {
                answer: (text) => chalk.reset(text),
              },
            },
          });

          if (lineNumber) {
            Verbose.custom("Requesting for new line content...");
            const newLine = await input({
              message: `Edit line ${lineNumber}: `,
              default: contents[lineNumber - 1],
              theme: {
                style: {
                  answer: (text) => chalk.reset(text),
                },
              },
            });

            Verbose.custom("Updating content...");
            contents[lineNumber - 1] = newLine; // Replace the selected line
            console.log(chalk.green(`Line ${lineNumber} has been updated.\n`));
          } else {
            console.log(chalk.red("Invalid line number.\n"));
          }
        }
      } else {
        Verbose.custom("Adding line to memory...");
        contents.push(line);
      }
    }
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

/**
 * Make a file.
 *
 * If a parent directory does not exist, this command
 * will not work.
 *
 * Note that there is a small hiccup in the error
 * codes, where if the path/file names are too long,
 * Linux and macOS will show the error code correctly
 * as `ENAMETOOLONG`, but Windows will show it as
 * `EINVAL`.
 *
 * @param {string} file The file that should be created. Both absolute and relative paths are accepted.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const mkfile = async (file, ...args) => {
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
      Errors.enterParameter("a file", "mkfile test.txt");
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

    await _fileContents(file);
  } catch (err) {
    Verbose.initShowPath();
    const showFile = new SettingManager().fullOrBase(file);

    if (err.code === "ENOENT") {
      // If the parent directory does not exist
      Verbose.chkExists(file);
      Errors.doesNotExist("file", showFile);
    } else if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("make the file", showFile);
    } else if (err.code === "ENAMETOOLONG") {
      // Name too long
      // This code only seems to appear on Linux and macOS
      // On Windows, the code is 'EINVAL'
      Verbose.custom("The file name was detected to be too long.");
      Errors.pathTooLong(showFile);
    } else if (err.code === "EINVAL") {
      // Invalid characters; basically just goes for Windows
      // NTFS' file system character limitations
      // However, Windows also uses this code when the file
      // path exceeds 260 characters, or when the file name
      // exceeds 255 characters
      Verbose.custom("The file name was detected to contain invalid characters, or is too long.");
      Errors.invalidCharacters(
        "directory name",
        "valid path characters",
        "characters such as '?' or ':' (Windows only)",
        showFile
      );
    } else if (err.code === "UNKNOWN") {
      Verbose.unknownError();
      Errors.unknown();
    } else {
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = mkfile;
