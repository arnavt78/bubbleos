const chalk = require("chalk");
const { keyInPause } = require("readline-sync");

const { GLOBAL_NAME } = require("./constants");

// Import all commands
const about = require("../commands/about");
const bub = require("../commands/bub");
const cd = require("../commands/cd");
const cls = require("../commands/cls");
const copy = require("../commands/copy");
const crash = require("../commands/crash");
const cwd = require("../commands/cwd");
const date = require("../commands/date");
const del = require("../commands/del");
const dirtree = require("../commands/dirtree");
const exec = require("../commands/exec");
const exit = require("../commands/exit");
const fif = require("../commands/fif");
const hash = require("../commands/hash");
const help = require("../commands/help");
const { history } = require("../commands/history");
const ifnet = require("../commands/ifnet");
const link = require("../commands/link");
const lock = require("../commands/lock");
const ls = require("../commands/ls");
const mkdir = require("../commands/mkdir");
const mkfile = require("../commands/mkfile");
const ping = require("../commands/ping");
const print = require("../commands/print");
const readfile = require("../commands/readfile");
const rename = require("../commands/rename");
const stat = require("../commands/stat");
const symlink = require("../commands/symlink");
const sysinfo = require("../commands/sysinfo");
const taskkill = require("../commands/taskkill");
const tasklist = require("../commands/tasklist");
const time = require("../commands/time");
const tips = require("../commands/tips");
const wcount = require("../commands/wcount");

// Easter egg :D
const cConCon = () => {
  console.log(`${chalk.bgGray.blue(` ${GLOBAL_NAME} `)}\n`);
  console.log(
    chalk.blueBright(
      "A fatal exception OE has occurred at 0028:C0034B03 in VXD VFAT(01) + 0000A3D7. The current application will be terminated.\n"
    )
  );
  console.log(chalk.blueBright(`*  Press any key to terminate ${GLOBAL_NAME}.`));
  console.log(chalk.blueBright(`*  Press CTRL+ALT+DEL to terminate your PC.\n`));
  keyInPause(chalk.blueBright(`Press any key to continue ${chalk.bold.grey("_")}`), {
    guide: false,
  });

  console.log();
  process.exit(1);
};

/**
 * All of the BubbleOS commands and their respective functions.
 *
 * Hard aliases are included in here, meaning commands such as
 * `dir`, which are not defined anywhere other than here,
 * will still invoke the `ls` command and run successfully instead
 * of failing.
 */
const COMMANDS = {
  about,
  bub,
  "C:\\con\\con": cConCon,
  cd,
  // Aliases: cls, clear
  cls,
  clear: cls,
  copy,
  crash,
  // Aliases: cwd, pwd
  cwd,
  pwd: cwd,
  date,
  del,
  // Aliases: dirtree, tree
  dirtree,
  tree: dirtree,
  exec,
  exit,
  fif,
  hash,
  help,
  history,
  ifnet,
  link,
  lock,
  // Aliases: ls, dir
  ls,
  dir: ls,
  mkdir,
  mkfile,
  ping,
  // Aliases: print, echo
  print,
  echo: print,
  readfile,
  rename,
  stat,
  symlink,
  sysinfo,
  taskkill,
  tasklist,
  time,
  tips,
  wcount,
};

/**
 * Soft aliases that will not work, but will attempt to help
 * the user find the correct command.
 *
 * Hard aliases are defined in the `COMMANDS` variable.
 */
const ALIASES = {
  about: ["info", "information", "ver", "version"],
  bub: ["bubble", "int", "interpret"],
  cd: ["chdir"],
  cls: [],
  copy: ["cp", "copyfile", "copydir"],
  crash: ["destroy"],
  cwd: ["pwd"],
  date: [],
  del: ["rm", "delete", "rmfile", "rmdir"],
  dirtree: [],
  exec: ["run"],
  exit: ["end"],
  fif: ["find", "search"],
  help: ["man"],
  history: ["hist"],
  ifnet: ["ipconfig", "ifconfig"],
  link: ["mklink", "ln"],
  lock: ["screensaver", "scr", "protect"],
  ls: ["ld"],
  mkdir: ["makedir"],
  mkfile: ["touch", "makefile"],
  ping: ["req", "request", "send"],
  print: [],
  readfile: ["cat", "more", "type", "rdfile", "read", "tail"],
  rename: ["mv", "ren"],
  stat: ["df", "fileinfo", "dirinfo", "pathinfo", "size"],
  symlink: ["symblnk", "ln", "link"],
  sysinfo: ["uname", "systeminfo", "userinfo", "whoami"],
  taskkill: ["kill"],
  tasklist: ["ps", "top", "htop"],
  time: [],
  tips: ["tip"],
  wcount: ["wc"],
};

module.exports = { COMMANDS, ALIASES };
