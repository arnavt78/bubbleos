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
const history = require("../commands/history");
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
const setmgr = require("../commands/setmgr");
const stat = require("../commands/stat");
const symlink = require("../commands/symlink");
const sysinfo = require("../commands/sysinfo");
const taskkill = require("../commands/taskkill");
const tasklist = require("../commands/tasklist");
const time = require("../commands/time");
const tips = require("../commands/tips");
const wcount = require("../commands/wcount");

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
  setmgr,
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
  cwd: [],
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
  setmgr: ["settings", "syscfg", "sysconfig", "sysedit"],
  stat: ["df", "fileinfo", "dirinfo", "pathinfo", "size"],
  symlink: ["symblnk"],
  sysinfo: ["uname", "systeminfo", "userinfo", "whoami"],
  taskkill: ["kill"],
  tasklist: ["ps", "top", "htop"],
  time: [],
  tips: ["tip"],
  wcount: ["wc"],
};

module.exports = { COMMANDS, ALIASES };
