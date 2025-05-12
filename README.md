# BubbleOS

BubbleOS is a useful and colorful shell for your operating system, with several features to make your computer use easier!

The latest stable version of BubbleOS is **[build 200](https://github.com/viradex/bubbleos/releases/tag/v2.0.0)**.

# Table of Contents

- [BubbleOS](#bubbleos)
- [Table of Contents](#table-of-contents)
- [Download and Installation](#download-and-installation)
  - [Downloading Standalone Executable](#downloading-standalone-executable)
  - [Running BubbleOS](#running-bubbleos)
    - [Windows](#windows)
    - [Linux and macOS](#linux-and-macos)
  - [Adding BubbleOS to the `PATH`](#adding-bubbleos-to-the-path)
    - [Windows](#windows-1)
    - [Linux and macOS](#linux-and-macos-1)
  - [Running BubbleOS on Windows 8.1 and Below](#running-bubbleos-on-windows-81-and-below)
  - [Installation from Source Code](#installation-from-source-code)
- [Booting](#booting)
  - [Welcome Message and Introduction](#welcome-message-and-introduction)
  - [Startup Errors](#startup-errors)
    - [No Color Support](#no-color-support)
    - [Failed to Create the Configuration File](#failed-to-create-the-configuration-file)
    - [Invalid Architecture](#invalid-architecture)
    - [Invalid OS](#invalid-os)
    - [Timebomb Expiry](#timebomb-expiry)
  - [Startup Arguments](#startup-arguments)
  - [Pre-Boot Interpreter](#pre-boot-interpreter)
  - [Update Checker](#update-checker)
  - [Configuration File](#configuration-file)
- [General Usage](#general-usage)
  - [Commands](#commands)
    - [`about`](#about)
    - [`bub`](#bub)
    - [`cd`](#cd)
    - [`cls` (also `clear`)](#cls-also-clear)
    - [`copy`](#copy)
    - [`crash`](#crash)
    - [`cwd` (also `pwd`)](#cwd-also-pwd)
    - [`date`](#date)
    - [`del`](#del)
    - [`dirtree` (also `tree`)](#dirtree-also-tree)
    - [`exec`](#exec)
    - [`exit`](#exit)
    - [`fif`](#fif)
    - [`hash`](#hash)
    - [`help`](#help)
    - [`history`](#history)
    - [`ifnet`](#ifnet)
    - [`link`](#link)
    - [`lock`](#lock)
    - [`ls` (also `dir`)](#ls-also-dir)
    - [`mkdir`](#mkdir)
    - [`mkfile`](#mkfile)
    - [`ping`](#ping)
    - [`print` (also `echo`)](#print-also-echo)
    - [`readfile`](#readfile)
    - [`rename`](#rename)
    - [`setmgr`](#setmgr)
    - [`stat`](#stat)
    - [`symlink`](#symlink)
    - [`sysinfo`](#sysinfo)
    - [`taskkill`](#taskkill)
    - [`tasklist`](#tasklist)
    - [`time`](#time)
    - [`tips`](#tips)
    - [`wcount`](#wcount)
  - [Errors](#errors)
    - [Unrecognized Command](#unrecognized-command)
    - [Missing Argument](#missing-argument)
    - [Does Not Exist](#does-not-exist)
    - [Invalid Permissions](#invalid-permissions)
    - [In Use](#in-use)
    - [Expected File](#expected-file)
    - [Expected Directory](#expected-directory)
    - [Invalid Encoding](#invalid-encoding)
    - [Invalid Characters](#invalid-characters)
    - [Path Too Long](#path-too-long)
    - [Invalid UNC Path](#invalid-unc-path)
    - [No Device](#no-device)
    - [Invalid Operation](#invalid-operation)
    - [Unknown Error](#unknown-error)
  - [Non-Fatal Errors and Fatal Errors](#non-fatal-errors-and-fatal-errors)
    - [Non-Fatal Error](#non-fatal-error)
    - [Fatal Error](#fatal-error)
  - [Verbose Mode](#verbose-mode)
  - [Command Interpreter](#command-interpreter)

# Download and Installation

This section covers information about getting BubbleOS to run on your device.

## Downloading Standalone Executable

BubbleOS does not have an installer program but instead has a standalone executable. BubbleOS is provided for the Windows, macOS, and Linux operating systems. To download it, go to the Releases GitHub page. Download the respective executables from the assets. The filename is named according to the OS it is intended to be run on:

- `windows-x64` for Windows
- `linux-x64` for Linux
- `macos-x64` for macOS

BubbleOS is not available for 32-bit operating systems.

## Running BubbleOS

### Windows

BubbleOS can be started by running the executable file directly through File Explorer or Command Prompt, PowerShell, or other command-line interpreters. Note that when running BubbleOS for the first time, a SmartScreen window may appear saying that the app may put your PC at risk. This can be safely ignored, and BubbleOS can be run by clicking _More Info_ and then _Run anyway_.

When BubbleOS is run, a command line will appear using the default terminal application (by default, this is the Command Prompt, but it can also commonly be the Windows Terminal on most systems). Generally, a terminal application that supports more color is recommended, such as Windows Terminal.

### Linux and macOS

To run BubbleOS on Linux and macOS, the file must be made executable. To do this, run `chmod +x linux-x64` on the BubbleOS executable (this may need to be run as `sudo` on macOS). Then, the file can be run from the Terminal.

## Adding BubbleOS to the `PATH`

### Windows

To add BubbleOS to the `PATH` to allow it to be run anywhere, follow the steps:

1. Move the BubbleOS executable to a location where it won’t be deleted.
2. Enter _sysdm.cpl_ in the Search menu or Run.
3. Go to the _Advanced_ tab, and then _Environment Variables_.
4. Click _New_ under _System Variables_ (or User Variables if you want to install BubbleOS for your user only).
5. Add the absolute path to the BubbleOS executable.
6. Press _OK_ on all the windows to confirm. BubbleOS should be available anywhere after a terminal restart.

### Linux and macOS

To add BubbleOS to the `PATH`, follow the steps respective to your terminal (usually Bash for Linux and Zsh for macOS):

For Bash (`~/.bashrc` or `~/.bash_profile`):

```
echo 'export PATH="/path/to/bubble_directory:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

For Zsh (`~/.zshrc`):

```
echo 'export PATH="/path/to/bubble_directory:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Then, restart the shell.

## Running BubbleOS on Windows 8.1 and Below

**WARNING: Do this at your own risk. Running BubbleOS on Windows versions below 8.1 is unsupported and can cause unexpected behavior.**

On Windows Vista and below, BubbleOS will fail to run. This cannot be circumvented.

1. Enter _sysdm.cpl_ in the Search menu or Run.
2. Go to the _Advanced_ tab, and then _Environment Variables_.
3. Click _New_ under _User Variables_ and add the key `NODE_SKIP_PLATFORM_CHECK` with a value of `1`.
4. Press _OK_ on all the windows to confirm.
5. To run BubbleOS, you must run the executable with the `--no-checks` flag.

## Installation from Source Code

To install BubbleOS from the source code, the following programs are required:

- [Node.js](https://nodejs.org/en) 22 or above (LTS)
- The BubbleOS source code, from the [Releases GitHub](https://github.com/viradex/bubbleos/releases) page

Ensure that Node.js has been installed by running `node -v` in the terminal. When the programs above are installed, follow the steps:

1. In the directory where the source code was extracted, run `npm install` in the terminal.
2. Linux and macOS: Run `chmod +x index.js` in the terminal.
3. Run `npm link`. BubbleOS should be installed and can be run using `bubble`.

On macOS, the commands may need to be run with `sudo` prefixed.

# Booting

This section covers information about the BubbleOS booting system.

## Welcome Message and Introduction

When running BubbleOS for the first time on the system, a welcome message will appear. This appears when the BubbleOS configuration file does not exist when BubbleOS is started up.

To continue past the welcome message and enter the CLI, press Enter when prompted.

When entering the CLI for the first time, the introduction is noticeably long, containing information such as the version, author, and command guides. This introduction only shows when launching BubbleOS for the first time, and when launching BubbleOS any other time after the first time, the introduction only displays the version (which can be disabled).

For beta builds and release candidates, a greyed-out warning message will always appear in the introduction, informing the user that the program is not a full release and can be unstable. If the timebomb is enabled, it will also show the expiry date. For beta builds, the timebomb expires 90 days after the executable is compiled, and for release candidates, the timebomb expires after 30 days.

The first introduction displays the following command usage:

- `help` – Display all available BubbleOS commands.
- `help <command>` – Display detailed information about a specific command.
- `setmgr` – Change the BubbleOS settings.
- `exit` – Exit the BubbleOS shell safely.

## Startup Errors

### No Color Support

BubbleOS requires the terminal to support at least 16 colors. If the terminal supports no color, then BubbleOS will end prematurely with an error stating:

```
BubbleOS requires the terminal to support at least 16 colors.
```

There is no way to circumvent this startup error. You must run BubbleOS in a terminal that supports color.

### Failed to Create the Configuration File

If BubbleOS fails to create the configuration file when it does not exist, an error will be thrown and BubbleOS will fail to start:

```
The BubbleOS configuration file was attempted to be created, but an error occurred when attempting to do so. BubbleOS cannot continue without this file.
```

This can be due to a variety of reasons but is mainly due to permission issues. Try manually creating a file named `bubbleos-config.json` at the root of the user directory, which can sometimes solve the issue.

This startup error cannot be circumvented, as BubbleOS relies on the configuration file for certain features to function correctly.

### Invalid Architecture

If BubbleOS detects the architecture to not be x64, it will crash on startup with the following message:

```
BubbleOS can only run on the x64 processor architecture. Please use a device with a processor that supports the x64 architecture.
```

This can be circumvented by using a device with an x64 processor or by running BubbleOS with the `--no-checks` flag.

### Invalid OS

If BubbleOS detects to be running on a version of Windows less than Windows 10, it will fail to start:

```
BubbleOS cannot run on Windows 8.1 and below. Please use a device that runs Windows 10 LTSC and later.
```

This can be circumvented by using an operating system that is supported, such as Windows 10 or Windows 11, or by running BubbleOS with the `--no-checks` flag.

### Timebomb Expiry

This startup error only occurs if the BubbleOS build is a beta or a release candidate.

When the timebomb expires, BubbleOS will no longer be able to startup, as a security feature to prevent using outdated unstable software. Upon encountering this error, it is recommended to download the latest version from the [Releases GitHub](https://github.com/viradex/bubbleos/releases) page.

The following message appears on startup when the timebomb expires:

```
This beta build of BubbleOS has expired. Please upgrade to a newer version of BubbleOS.
```

Upon pressing Enter, BubbleOS will crash with a fatal error.

To circumvent this issue, the system’s time can be set back to before the timebomb expires, download a newer version of BubbleOS, or run BubbleOS with the `--no-timebomb` flag.

## Startup Arguments

The startup arguments are run with the BubbleOS executable and change the regular behavior of BubbleOS.

To view information about these startup arguments in BubbleOS, run the BubbleOS executable with the `-h` argument.

- `--no-checks` – Disables checking if BubbleOS is running on the correct architecture (x64) or on the correct OS (Windows 10 and above).
- `--no-dump` – Disables the fatal error file dump feature, which outputs a file containing error information that can be submitted in a bug report whenever a fatal error occurs.
- `--no-timebomb` – Disables checking if the timebomb has expired.
- `--no-warnings` – Disables showing warnings during startup if the fatal error file dump feature or the timebomb were disabled.
- `--reset` – Resets the BubbleOS configuration file, clearing all data. This requires a restart once BubbleOS finishes booting.
- `--delete` – Deletes the BubbleOS configuration file.
- `--verbose` – Enables verbose mode to give more information about processes. Useful for debugging if something goes wrong.
- `-h` – Displays the help information about the startup arguments.
- `-v` – Displays the current version of BubbleOS.

## Pre-Boot Interpreter

The pre-boot interpreter is a feature that allows running one command directly from the BubbleOS executable without initializing the CLI. The pre-boot interpreter supports running almost all commands in the normal shell and supports arguments to modify the behavior of the command.

To run the pre-boot interpreter, enter the command that should be run, and then the necessary parameters and arguments.

```
bubble print Hello, world!
```

BubbleOS will immediately exit when the command finishes executing.

The following commands are prevented from running in the pre-boot interpreter:

- `cd`
- `exit`
- `history`
- `setmgr`
- `tips`

## Update Checker

BubbleOS will check for updates every week, and when it launches for the first time. By default, it only checks for full releases (not betas and release candidates), however this behavior can be modified using the `setmgr` command.

Specifically, BubbleOS checks for updates every Sunday at 12:00AM local time (the next time to check for updates is defined in the BubbleOS configuration file). After it finishes checking for an update, BubbleOS will automatically check the following week.

If there is an update available, BubbleOS will show a large box after the introduction informing about an update, the version number, and the link to download it.

The update checker feature can be disabled in `setmgr`.

## Configuration File

The BubbleOS configuration file stores information required for BubbleOS to function correctly. The configuration file stores values such as:

- Command history
- Settings
- BubbleOS build (and release candidate) that the file was last opened in
- If BubbleOS crashed previously
- The date to next check for updates

BubbleOS will check if the configuration file exists after every command execution, and during the startup. If it detects the file has been corrupted or removed, it will reset the configuration file and restart BubbleOS.

The configuration file is located in the user’s home directory, and is stored as `bubbleos-config.json`. The file is extremely compact and usually takes up less than a kilobyte of space.

This file can be reset by running the BubbleOS executable with the `--reset` argument, or deleted using the `--delete` argument. Note this will clear all history and settings.

# General Usage

This section covers the general usage of the BubbleOS CLI.

## Commands

BubbleOS contains a variety of commands. In total, there are 35 commands.

To get information about a command, use `help <command>` in the BubbleOS CLI.

### `about`

Shows information about BubbleOS, such as the version, author, and links. The license can also be displayed by running the command with the `-l` argument.

### `bub`

Runs a `.bub` file, which contains BubbleOS commands run one by one, similar to a batch file.

The file supports comments, which begin with a hashtag. These lines are ignored by the file interpreter.

The `exit` command is not allowed to be run by default. To allow the file to exit the BubbleOS shell, run the command with the `--allow-exit` argument. To display the commands being executed as defined in the file, use the `-d` flag.

### `cd`

Changes the current working directory into the one specified. This also supports symbolic links.

### `cls` (also `clear`)

Clears the entire terminal screen, including non-visible parts.

### `copy`

Copies a file or directory from one location to another. If the destination already exists, the user is prompted to delete the file or directory and then copy the source.

There are arguments for the command, however, they are only for copying directories. The `-t` argument keeps the timestamps of all files and directories to the last modified date, instead of changing them when the directory is copied. The `--rm-symlink` argument dereferences symbolic links in the directory and replaces it with a copy of the actual contents of the file or directory it was pointing to.

### `crash`

Crashes BubbleOS, the terminal, and Windows in specific ways. There are five choices when running the command that the user is prompted to select:

- Non-fatal error: Throws a BubbleOS non-fatal error. This does not crash BubbleOS, but instead only terminates the crash command. BubbleOS is still functional after this if the user decides to continue using BubbleOS.
- Fatal error: Crashes BubbleOS with a fatal error. A file dump containing the error information was also made in the current directory BubbleOS was in before it crashed.
- Hang: Hang the terminal, making it extremely difficult to end by pressing Ctrl+C on BubbleOS.
- Memory leak: Leaks memory from the computer. Usually leaks about 2-4GB of memory from the computer before BubbleOS crashes once it reaches its maximum allocated memory.
- Blue Screen of Death (BSOD): Crashes Windows with a Blue Screen of Death. This only works on Windows when BubbleOS is run as an administrator.

Before running the command, it is recommended to save all work, especially for the BSOD option.

### `cwd` (also `pwd`)

Outputs the current working directory of BubbleOS, as an absolute path.

### `date`

Outputs the system date in a friendly format and slash format. They are formatted as follows:

- Friendly format: Friday, the 31st of January, 2025
- Slash format: 01/31/2025

### `del`

Deletes a file or directory permanently. This can also delete empty directories.

### `dirtree` (also `tree`)

Shows a visual directory tree of the directory specified. The tree shows all child directories and files and continues if the child directories contain contents. If the directory is not specified, it defaults to using the current working directory.

### `exec`

Executes a file. If the file is executable, BubbleOS will attempt to launch the program. However, if the file is a regular file, BubbleOS will launch the file in the default program used to view the file. For example, if a `.txt` file is executed and the default file viewing application is Notepad, the file will be opened in Notepad.

### `exit`

Safely exits the BubbleOS shell.

### `fif`

Finds a word or phrase in a file. By default, the command shows the number of occurrences and the visual locations of each phrase, by showing the contents of the file and highlighting the phrases in yellow.

If any of the arguments below are passed, only the arguments specified will be shown.

- `-n` – Shows the number of occurrences.
- `-p` – Shows the character location of occurrences.
- `-v` – Shows the visual occurrences.

The command can only read plain-text files.

### `hash`

Shows the hashes of a file. By default, if no specific hashes are specified by the user when prompted to enter them, the command will show all available hashes. The types of hashes the command supports are listed below:

- MD5
- SHA1
- SHA224
- SHA256
- SHA384
- SHA512
- SHA3-224
- SHA3-256
- SHA3-384
- SHA3-512
- SHAKE128
- SHAKE256

The hashes can be entered in when prompted to do so, and multiple can be entered by separating the hashes with a space.

### `help`

Displays all available commands in BubbleOS when entered standalone or shows more information about a specific command when entered with the command as an argument.

The extra information that is displayed when requesting information about a specific command includes the command name, usage, description, and available arguments.

### `history`

Displays the last 50 commands entered into BubbleOS, even if they throw an error or do not exist. The history persists throughout sessions, as the history is stored in the BubbleOS configuration file.

The command at a specific history point can be retrieved by passing a number between 1-50 with the command. This will only show the command stored at the point requested.

The `-c` argument can be used to clear the history.

### `ifnet`

Displays information about network interfaces running on the system. This includes the IP address, netmask, family, MAC address, CIDR, scope ID, and whether it is internal.

### `link`

Creates a hard link that points to the source file. Hard links replicate the data of the source and keep the data even when the source is deleted.

This does not work on directories.

### `lock`

Locks the operating system that BubbleOS is running on, by showing the lock screen. This requires the `xdg-screensaver` application to be installed on some Linux systems.

### `ls` (also `dir`)

Lists the contents of a specified directory, or the current working directory if none are specified. Files are colored green, directories are bold blue, file symbolic links are red, directory symbolic links are bold red, and hidden files and directories are grey (it is considered hidden if the name begins with a dollar sign, underscore, or period).

The `-s` argument lists the contents in a short view, printing the contents in a grid view.

Directories are always shown before files.

### `mkdir`

Creates a directory in the specified location, with the name given. If the directory already exists, the user will be prompted to confirm they want to delete the directory so that it can be replaced with the new directory.

By default, the directory does not have any attributes and is empty.

### `mkfile`

Creates a file in the specified location, with the name given. If the file already exists, the user will be prompted to confirm they want to delete the file so that it can be replaced with a new file.

When creating a file, the user will be prompted to enter the file contents in a basic file editor. When pressing Enter, a new prompt will appear for the next line. To edit a previous line, enter `!EDIT` by itself on a new line, and specify the line that should be edited. A prompt will appear to edit that specific line. Enter `!SAVE` once the file contents have been entered, which will save the file with the text contents. Enter `!CANCEL` to discard the file contents and abort the file creation.

To create a file with no contents, enter `!SAVE` on the first prompt.

By default, the file does not have any attributes.

### `ping`

Pings a specified address for a response. BubbleOS will ping the server and give the response status code and name (for example, 404 Not Found). If the server can be successfully pinged, a response with 200 OK will be returned, else, a different message will be sent. Common error codes include 403 Forbidden, 404 Not Found, and 500 Internal Server Error.

The command supports up to five redirects. If BubbleOS is redirected more than five times, it will fail with an error. The timeout is five seconds, after which the ping will fail with an error.

### `print` (also `echo`)

Prints the specified text to the terminal.

### `readfile`

Reads a plain-text file and outputs the contents. This command does not support reading non-UTF8 files, to prevent terminal character corruption.

If the file contains more than 5000 characters, the user will be prompted to make sure they want to read the large file. BubbleOS, by default, does not support reading files that are more than 100,000 characters long, however, this can be bypassed with the `--ignore-max` argument.

### `rename`

Renames a file or directory from the old name to the new specified name. The old and new names cannot be the same. If the new name already exists, the user will be prompted to confirm they want to overwrite the file.

This command can also be used as a 'cut' action if a different path is specified in the new name field.

### `setmgr`

Change the settings of BubbleOS. When run, the command sets up a temporary environment for changing the settings, by clearing the screen, and showing each setting one by one When each setting shows, the title and description of the setting are shown, as well as the current option and default option. The user will be requested to select their preferred setting. By default, the selection will be on the current setting.

The available settings are described below.

| Name                       | Description                                                           | Default         | Options                           |
| -------------------------- | --------------------------------------------------------------------- | --------------- | --------------------------------- |
| Case-Sensitive Commands    | Make commands case-sensitive or case-insensitive.                     | Case-Sensitive  | Case-Sensitive, Case-Insensitive  |
| Confirm Exiting BubbleOS   | Show a confirmation prompt before exiting BubbleOS.                   | No              | Yes, No                           |
| Full Path or Basename      | Choose whether to display the full path or just the basename.         | Full Path       | Full Path, Basename               |
| Show Message Label Prefix  | Show the prefix labels on messages (success, error, etc.).            | Yes             | Yes, No                           |
| Show Version on Startup    | Show the version of BubbleOS when it is started.                      | Yes             | Yes, No                           |
| Silence Success Messages   | Silence most success messages from commands.                          | No              | Yes, No                           |
| Update Checker             | Choose what type of BubbleOS updates to get from the update checker.  | Releases        | Releases, Pre-Releases, None      |

### `stat`

Gets information about a specified file or directory (or the current working directory if not specified), including the absolute location, size, accessed, modified, and created dates. The unit of size to display is done automatically.

### `symlink`

Creates a symbolic link between two files/directories or checks if a specified path is a symbolic link.

To check if a path is a symbolic link, only enter one path which is the path to check. If the path is a symbolic link, the command will also output the location to the file/directory it points to.

To link two files or directories, enter the target (the original file) and the path (the new file that links to the original target file). This requires administrator permission, so BubbleOS will usually need to be run as Administrator/root for this command to function correctly.

### `sysinfo`

Shows information about the local system that BubbleOS is running on. Information is categorized into subheadings.

By default, computer information, user information, and system resources are displayed. However, these can be modified using arguments (`-c` for computer information, `-u` for user information, `-s` for system resources, `-a` for advanced information, and `-e` for environment variables). Alternatively, the `--all` argument displays all available information that is not shown by default, including advanced information and environment variables.

All the information that is displayed by the command is shown below:

- Computer Information
    - Full operating system name
    - Operating system
    - Release
    - Architecture
    - Computer name
    - Locale
- User Information
    - Username
    - Home directory
    - Temporary directory
    - Group identifier (all OSes other than Windows)
    - User identifier (all OSes other than Windows)
    - Shell (all OSes other than Windows)
- System Resources
    - Memory usage
    - System uptime
    - Battery level and charging status
    - CPU cores
    - CPU information and speed
- Advanced Information
    - NULL device
    - Estimated default parallelism amount (program)
    - BubbleOS process identification number
- Environment Variables
    - List of all environment variables and values

The memory usage and battery level values are color-coded, and environment variables are alphabetically sorted.

For the memory, if a third of memory is available, red text is shown. If a third of the memory is used, green text is shown. If it is in between, the yellow text is shown.
For the battery, if the device is on charge, green text is always shown. If the device is not on charge and there is above 50% remaining, yellow text is shown. If it is below 50%, red text is shown.

### `taskkill`

Kills a specified process running on the computer. The process name or process identification number can be passed. When run, BubbleOS sends a `SIGTERM` signal to the program specified. It is recommended to save your work when killing a process that contains important information, as the data can be lost if the process terminates without gracefully shutting down.

### `tasklist`

Shows all the processes running on the system. The command displays the process name and identification number. A specific process can be filtered for by entering the process name as an argument in the command, which will only show processes with the name entered if they exist.

### `time`

Outputs the system time in 12-hour time (by default) or 24-hour time. The format of time can be changed by using the `-24` argument. The time is formatted as follows:

- 12-hour time: 2:37:46 PM
- 24-hour time: 14:37:46

### `tips`

Shows various tips and useful information relating to the usage of BubbleOS. There are approximately 20 tips, and they reset once all the tips have been shown.

### `wcount`

Shows the number of lines, words, and characters in a file. If the number of characters with and without whitespace are the same, they are combined into one value.

By default, all the values show, however, they can be customized using arguments: `-l` for lines, `-w` for words, and `-c` for characters.

## Errors

### Unrecognized Command

**Error code: 1**

When the command entered in the command interpreter or the help command could not be recognized. If BubbleOS cannot find the command that the user entered as a direct reference or a hard alias, it will throw this error.

When this error appears in the command interpreter, and a soft alias is found for what the user entered, BubbleOS will attempt to help the user by asking if they meant the command that exists. For example, entering `touch` will throw an unrecognized command error, but it will also say that the correct command is likely `mkfile`.

### Missing Argument

**Error code: 2**

A command was entered without all required arguments. The error message will tell the type of argument that needs to be passed (e.g. a file) and an example of command usage.

### Does Not Exist

**Error code: 3**

The specified path or resource does not exist when BubbleOS attempted to access it.

### Invalid Permissions

**Error code: 4**

BubbleOS does not have permission to do the action that was requested (e.g. delete a file). This can be averted by running BubbleOS with elevated privileges, such as Administrator on Windows or superuser on Linux/macOS.

### In Use

**Error code: 5**

The resource that BubbleOS tried to access/modify is currently in use by another process. The process must either stop using the resource or be terminated for BubbleOS to be able to use the resource.

### Expected File

**Error code: 6**

The argument passed was expected to be a file, but a directory was passed instead.

### Expected Directory

**Error code: 7**

The argument passed was expected to be a directory, but a file was passed instead.

### Invalid Encoding

**Error code: 8**

The file that was attempted to be read was in an invalid encoding. BubbleOS does not support reading non-plaintext files to avoid terminal character corruption.

### Invalid Characters

**Error code: 9**

The phrase that was entered can only contain certain types of characters but was detected to contain invalid characters. For example, a phrase contained hashtags when it was specifically disallowed to contain such characters.

### Path Too Long

**Error code: 10**

The path is too long. In most file systems, the limit of a path is around 255 characters. To circumvent this error, choose shorter names for files and directories.

### Invalid UNC Path

**Error code: 11**

This error only applies to Windows. UNC paths are not supported by BubbleOS and will throw this error when passed as an argument.

### No Device

**Error code: 12**

A device or address was attempted to be accessed that does not exist.

### Invalid Operation

**Error code: 13**

An invalid operation was attempted with a resource by BubbleOS.

### Unknown Error

**Error code: 14**

An unknown error occurred when BubbleOS attempted to access a resource.

## Non-Fatal Errors and Fatal Errors

When an uncaught exception occurs in BubbleOS, a non-fatal error or fatal error will occur, depending on the severity of the issue. These errors almost always describe a bug in BubbleOS and should be reported as an issue on the [GitHub page](https://github.com/viradex/bubbleos/issues/new).

It is recommended to submit the technical error information, as well as the steps needed to reproduce the issue.

### Non-Fatal Error

This shows when an uncaught exception occurs while a command is executing. When a non-fatal error occurs, the command immediately terminates and the user is shown information about the non-fatal error, what they should do, and technical error information. The user is then prompted on whether they want to continue using BubbleOS or terminate the process.

### Fatal Error

This shows when an uncaught exception occurs in critical functions of BubbleOS, such as the command interpreter. When a fatal error occurs, the BubbleOS process terminates and displays the fatal error screen, which informs users what they should do and provides technical error information. An error information file is also saved in the current working directory BubbleOS was in before it crashed. Once the user presses Enter when informed to do so, the process will fully terminate.

## Verbose Mode

BubbleOS includes a verbose mode, useful for getting more information about specific internal processes and debugging. To enable verbose mode, run the BubbleOS executable with the `--verbose` flag.

Verbose messages are yellow and include the exact time in 24-hour time, including milliseconds. The verbose message is usually short and sometimes contains dynamic variables.

## Command Interpreter

The command interpreter runs when BubbleOS finishes booting and is the prompt that the user enters their commands in. The command interpreter prompt currently looks like this:

```
bubble /current/working/directory $
```

By default, the commands entered into the command interpreter are case-sensitive, however, this can be modified in `setmgr`.

If the command interpreter recognizes a command, it will be run. Once the command finishes executing, the command interpreter will appear again. If the command interpreter does not recognize the command entered, it will throw an error. However, if the command was recognized as a soft alias, BubbleOS will suggest a similar command.

At the end of a command execution, the command is entered into history, even if it was unrecognized or threw an error. The configuration file is verified to ensure it hasn’t been deleted or corrupted.
