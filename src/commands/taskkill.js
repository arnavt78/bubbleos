const chalk = require("chalk");
const psList = require("ps-list");

const _promptForYN = require("../functions/promptForYN");
const _nonFatalError = require("../functions/nonFatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");
const PathUtil = require("../classes/PathUtil");
const SettingManager = require("../classes/SettingManager");

/**
 * Kill a process on the device using either the PID
 * or process name.
 *
 * Available arguments:
 * - `-y`: Automatically accept the confirmation
 * prompt.
 *
 * @param {string | number} processName The PID or process name to kill.
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const taskkill = async (processName, ...args) => {
  try {
    Verbose.initChecker();
    const processChk = new Checks(processName);

    Verbose.initArgs();
    const confirm = !args.includes("-y");

    Verbose.parseQuotes();
    processName = PathUtil.parseQuotes([processName, ...args])[0];

    if (processChk.paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a process name or PID", "taskkill test.exe");
      return;
    }

    Verbose.custom("Checking for running processes...");
    const processes = await psList();

    let processExists;
    let processObj;
    let processNameFromPid;

    if (!isNaN(Number(processName))) {
      // processName is a PID
      processExists = processes.some((obj) => obj.pid === Number(processName));
      if (processExists) {
        processObj = processes.find((obj) => obj.pid === Number(processName));
        processNameFromPid = processObj ? processObj.name : null;
      }
    } else {
      // processName is a process name
      processExists = processes.some((obj) => obj.name === processName);
      if (processExists) {
        processObj = processes.find((obj) => obj.name === processName);
        processNameFromPid = processObj ? processObj.name : null;
      }
    }

    if (!processExists) {
      Verbose.custom(`The process '${processName}' was detected to not exist.`);
      Errors.doesNotExist("process", processName);
      return;
    }

    // If the user did not use the '-y' flag
    if (confirm) {
      Verbose.promptUser();
      if (
        !_promptForYN(
          `Are you sure you want to kill the process ${chalk.bold(processNameFromPid)}?`
        )
      ) {
        console.log(chalk.yellow("Process aborted.\n"));
        return;
      }
    }

    if (!isNaN(Number(processName))) {
      Verbose.custom("Attempting to kill process...");
      process.kill(Number(processName));

      // If the user did not request output, show a newline, else, show the success message
      if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
        InfoMessages.success(`Successfully killed the process ${chalk.bold(processNameFromPid)}.`);
      else console.log();
    } else {
      processes.forEach((obj) => {
        if (obj.name === processName) {
          Verbose.custom("Attempting to kill process...");
          try {
            process.kill(Number(obj.pid));

            // If the user did not request output, show a newline, else, show the success message
            if (!new SettingManager().checkSetting("silenceSuccessMsgs"))
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
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = taskkill;
