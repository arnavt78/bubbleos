const chalk = require("chalk");
const psList = require("ps-list");

const { GLOBAL_NAME } = require("../variables/constants");

const _promptForYN = require("../functions/promptForYN");
const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

/**
 * Checks if the user wants to kill the BubbleOS process,
 * and gives a message if so.
 *
 * @param {string | number} pid The PID that the user entered.
 * @param {boolean} killSelf Whether or not the user allowed BubbleOS to kill itself.
 * @returns `true` if the user attempted to kill BubbleOS, `false` otherwise.
 */
const _killSelfMsg = (pid, killSelf) => {
  // If the PID is equal to BubbleOS' PID and the user did not give permission to kill itself
  if (Number(pid) === process.pid && !killSelf) {
    Verbose.custom("Attempted to kill BubbleOS process...");
    console.log(
      chalk.yellow(
        `You cannot kill the ${GLOBAL_NAME} process. To exit ${GLOBAL_NAME}, run the '${chalk.italic(
          "exit"
        )}' command.\nProcess aborted.\n`
      )
    );

    return true;
  }

  return false;
};

/**
 * Kill a process on the device from the BubbleOS
 * CLI shell, using the provided PID (process
 * identification number) or process name.
 *
 * Available arguments:
 * - `-y`: Automatically accept the confirmation
 * prompt.
 * - `-s`: Silence all success messages, excluding
 * error messages and the confirmation prompt.
 * - `--kill-self`: Allow killing the BubbleOS process.
 * Use this flag at your own risk, as it can remove any
 * unsaved data in BubbleOS!
 *
 * @param {string | number} processName The PID or process name to kill.
 * @param {...string} args Arguments to change the behavior of `taskkill` (listed above).
 */
const taskkill = async (processName, ...args) => {
  try {
    Verbose.initChecker();
    const processChk = new Checks(processName);

    Verbose.initArgs();
    const confirm = !args?.includes("-y");
    const silent = args?.includes("-s");
    const killSelf = args?.includes("--kill-self");

    if (processChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a process name or PID", "taskkill test.exe");
      return;
    }

    // If the user did not use the '-y' flag
    if (confirm) {
      Verbose.promptUser();
      if (!_promptForYN(`Are you sure you want to kill the process ${chalk.bold(processName)}?`)) {
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }
    }

    if (!isNaN(Number(processName))) {
      if (_killSelfMsg(processName, killSelf)) return;

      Verbose.custom("Attempting to kill process...");
      process.kill(Number(processName));

      // If the user did not request output, show a newline, else, show the success message
      if (!silent)
        InfoMessages.success(`Successfully killed the process ${chalk.bold(processName)}.`);
      else console.log();
    } else {
      const processes = await psList();
      const result = processes.find((obj) => obj.name === processName);

      processes.forEach((obj) => {
        if (obj.name === processName) {
          if (_killSelfMsg(result.pid, killSelf)) return;

          Verbose.custom("Attempting to kill process...");
          try {
            process.kill(Number(result.pid));

            // If the user did not request output, show a newline, else, show the success message
            if (!silent)
              InfoMessages.success(`Successfully killed the process ${chalk.bold(processName)}.`);
            else console.log();
          } catch (err) {
            // In case there are some processes that have perm errors,
            // one error won't cause the command to terminate
            if (err.code === "EPERM" || err.code === "EACCES") {
              Verbose.permError();
              Errors.noPermissions("kill the process", processName);
            }
          }
        }
      });
    }
  } catch (err) {
    if (err.code === "EPERM" || err.code === "EACCES") {
      Verbose.permError();
      Errors.noPermissions("kill the process", processName);
    } else if (err.code === "ESRCH") {
      Verbose.custom(`The process '${processName}' was detected to not exist.`);
      Errors.doesNotExist("process", processName);
    } else {
      Verbose.fatalError();
      _fatalError(err, false);
    }
  }
};

module.exports = taskkill;
