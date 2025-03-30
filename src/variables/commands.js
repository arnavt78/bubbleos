// BubbleOS Commands
const about = require("../commands/bubbleos/about");
const bub = require("../commands/bubbleos/bub");
const exit = require("../commands/bubbleos/exit");
const help = require("../commands/bubbleos/help");
const history = require("../commands/bubbleos/history");
const setmgr = require("../commands/bubbleos/setmgr");
const tips = require("../commands/bubbleos/tips");

// File System Commands
const cd = require("../commands/fs/cd");
const copy = require("../commands/fs/copy");
const cwd = require("../commands/fs/cwd");
const del = require("../commands/fs/del");
const dirtree = require("../commands/fs/dirtree");
const exec = require("../commands/fs/exec");
const fif = require("../commands/fs/fif");
const hash = require("../commands/fs/hash");
const link = require("../commands/fs/link");
const ls = require("../commands/fs/ls");
const mkdir = require("../commands/fs/mkdir");
const mkfile = require("../commands/fs/mkfile");
const readfile = require("../commands/fs/readfile");
const rename = require("../commands/fs/rename");
const stat = require("../commands/fs/stat");
const symlink = require("../commands/fs/symlink");
const wcount = require("../commands/fs/wcount");

// Gaming Commands
const snake = require("../commands/gaming/snake");
const tetris = require("../commands/gaming/tetris");

// Other Commands
const cls = require("../commands/other/cls");
const crash = require("../commands/other/crash");
const print = require("../commands/other/print");
const { cConCon, creeper, newton, error } = require("../commands/other/special");

// System Commands
const audio = require("../commands/system/audio");
const battery = require("../commands/system/battery");
const bluetooth = require("../commands/system/bluetooth");
const cpu = require("../commands/system/cpu");
const date = require("../commands/system/date");
const disks = require("../commands/system/disks");
const graphics = require("../commands/system/graphics");
const hardware = require("../commands/system/hardware");
const ifnet = require("../commands/system/ifnet");
const lock = require("../commands/system/lock");
const mem = require("../commands/system/mem");
const os = require("../commands/system/os");
const ping = require("../commands/system/ping");
const printer = require("../commands/system/printer");
const sysinfo = require("../commands/system/sysinfo");
const taskkill = require("../commands/system/taskkill");
const tasklist = require("../commands/system/tasklist");
const time = require("../commands/system/time");
const usb = require("../commands/system/usb");

/**
 * All of the BubbleOS commands and their respective functions.
 *
 * Hard aliases are included in here, meaning commands such as
 * `dir`, which are not defined anywhere other than here,
 * will still invoke the `ls` command and run successfully instead
 * of failing.
 */
const COMMANDS = {
  // BUBBLEOS COMMANDS
  // -----------------
  about,
  bub,
  exit,
  help,
  history,
  setmgr,
  tips,

  // FILE SYSTEM COMMANDS
  // --------------------
  cd,
  copy,
  // Aliases: cwd, pwd
  cwd,
  pwd: cwd,
  del,
  // Aliases: dirtree, tree
  dirtree,
  tree: dirtree,
  exec,
  fif,
  hash,
  link,
  // Aliases: ls, dir
  ls,
  dir: ls,
  mkdir,
  mkfile,
  readfile,
  rename,
  stat,
  symlink,
  wcount,

  // GAMING COMMANDS
  // ---------------
  snake,
  tetris,

  // OTHER COMMANDS
  // --------------
  // Aliases: cls, clear
  cls,
  clear: cls,
  crash,
  // Aliases: print, echo
  print,
  echo: print,
  "c:\\con\\con": cConCon,
  "C:\\con\\con": cConCon,
  creeper,
  newton,
  error,

  // SYSTEM COMMANDS
  // ---------------
  audio,
  battery,
  bluetooth,
  cpu,
  date,
  disks,
  graphics,
  hardware,
  ifnet,
  lock,
  // Aliases: mem, ram
  mem,
  ram: mem,
  os,
  ping,
  printer,
  sysinfo,
  taskkill,
  tasklist,
  time,
  usb,
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
