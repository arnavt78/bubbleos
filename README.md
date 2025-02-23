# BubbleOS

**⚠️ This file is a work-in-progress for the next stable release and can be inaccurate. Information is subject to changes!**

BubbleOS is a useful and colorful shell for your operating system, with several features to make your computer use easier!

The latest stable version of BubbleOS is **[build 200](https://github.com/arnavt78/bubbleos/releases/tag/v2.0.0)**.

## Table of Contents

- [BubbleOS](#bubbleos)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Executable](#executable)
    - [`PATH` Installer](#path-installer)
      - [`EXE` File](#exe-file)
        - [Windows](#windows)
        - [macOS/Linux](#macoslinux)
      - [Windows 8 and Below](#windows-8-and-below)
      - [`ZIP` File](#zip-file)
  - [Using Bubble](#using-bubble)
  - [Commands](#commands)

## Installation

There is no installer, but just a portable executable. You can also download the `zip` file (more instructions below).

### Executable

For the portable executable, go the the [Releases](https://github.com/arnavt78/bubbleos/releases) page and download the file for your respective operating system (Windows, macOS, Linux).

Running the executable should open it in a terminal window. You can also run this through command prompt (Windows), or the terminal (Mac/Linux), or other command prompt-like apps (e.g. PowerShell).

Note that for Linux and macOS, you may need to run `chmod +x <file>` on the executable.

### `PATH` Installer

**Recommended for advanced users only!**

#### `EXE` File

If you want to add `bubble` to your path, first install the executable from the [Releases](https://github.com/arnavt78/bubbleos/releases).

##### Windows

In Windows, follow the steps below:

1.  Move the Bubble executable to a place where you won't delete it (e.g. `C:\Windows`).
2.  Press <kbd>Windows</kbd> + <kbd>R</kbd>, and type `sysdm.cpl`. Press <kbd>Enter</kbd>.
3.  Go to the _Advanced_ tab, and then click _Environment Variables_.
4.  If you want to add it for your user only, click _New_ under user variables, else, click _New_ under system variables.
5.  Click _New_ and add the path to the Bubble executable.
6.  Close all of the windows by clicking _Ok_. It should work now anywhere in the command prompt!

##### macOS/Linux

In macOS/Linux, follow the steps below:

1. Add the BubbleOS executable to the PATH.
   For Bash (`~/.bashrc` or `~/.bash_profile`):

```sh
echo 'export PATH="/path/to/bubble_directory:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

For Zsh (`~/.zshrc`):

```sh
echo 'export PATH="/path/to/bubble_directory:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

2. Restart the shell.

#### Windows 8 and Below

BubbleOS will crash on startup if run on a computer that is running Windows 8 or lower. To fix this issue, follow the steps below.

**DISCLAIMER:** Do this at your own risk. BubbleOS was not intended to run on Windows 8.1 or lower, therefore, you may experience bugs. **DO NOT** create any issues about issues faced on Windows 8.1 and below relating to the incompatible OS.

Note that on Windows Vista and below, BubbleOS will not run at all.

1.  Press <kbd>Windows</kbd> + <kbd>R</kbd>, and type `sysdm.cpl`. Press <kbd>Enter</kbd>.
2.  Navigate to the _Advanced_ tab, and then click _Environment Variables_.
3.  Click _New_ under user variables, and add the key `NODE_SKIP_PLATFORM_CHECK`, with a value of `1`. Press _OK_ when completed.
4.  Repeat Step 3 for the system variables section.
5.  Press _OK_ and _OK_ again.
6.  Restart your system. After that, BubbleOS should run fine!

#### `ZIP` File

To add BubbleOS to your path, you can just install the latest version of Node.js from [this website](https://nodejs.org/en/). To see if you have it installed or not, run the following command:

```
$ node -v
```

If it returns an error, you don't have it installed. Otherwise, it is installed.

Once that is done, you need to extract the `zip` contents and run the following command in the root directory:

```
$ npm install
```

**LINUX ONLY!** Run the following command in the root to make the file executable.

```
$ chmod +x index.js
```

**All OSes:** Now run the following command in the root directory:

```
$ npm link
```

Now, you can run BubbleOS anywhere from the command prompt/terminal by just typing in `bubble`.

## Using Bubble

If you have downloaded the executable, just run the file like usual. If you have downloaded the source code and already followed the above steps, run `bubble` in your command interpreter/terminal.

## Commands

There are many commands in BubbleOS to help make your journey smooth. It also comes with a ton of other features! These are the available commands (to get help on a specific one, install BubbleOS and run `help <command>`.

- `about`
- `bub`
- `cd`
- `cls` (also `clear`)
- `copy`
- `crash`
- `cwd` (also `pwd`)
- `date`
- `del`
- `dirtree` (also `tree`)
- `exec`
- `exit`
- `fif`
- `hash`
- `help`
- `history`
- `ifnet`
- `link`
- `lock`
- `ls` (also `dir`)
- `mkdir`
- `mkfile`
- `ping`
- `print` (also `echo`)
- `readfile`
- `rename`
- `setmgr`
- `stat`
- `symlink`
- `sysinfo`
- `taskkill`
- `tasklist`
- `time`
- `tips`
- `wcount`
