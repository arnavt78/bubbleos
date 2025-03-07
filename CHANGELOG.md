# BubbleOS Changelog

This is the official BubbleOS changelog! All features will be recorded in _'groups'_, and the latest version of that _'group'_ will have an executable and a release paired with them.

## Build 200 RC3 to 200 RC4 (v2.0.0-rc3 to v2.0.0-rc4)

### Added Features

_No added features._

### Changed/Fixed Features

- Significantly improved performance of the command interpreter and `taskkill` command.
- The `symlink` command no longer requires the `-c` argument to check if a path is a symbolic link. Instead, if one path is entered, the command will automatically check if the specified path is a symbolic link.
- Modified the internal system of executing files in the `exec` command, allowing it to be faster and more flexible.
- Changed the environment variables displayed in the `sysinfo` command to be alphabetically sorted.
- Changed the _exiting BubbleOS shell_ message to be bolded.
- Edited some tips to be correct due to recent changes.
- Fixed an issue where entering a period at the end of a URL in the `ping` command would cause it to crash.
- Fixed an issue where the `mkfile` and `mkdir` commands would crash if the file/directory could not be deleted if it already exists.
- Fixed an issue where the `symlink` command would crash if the symbolic link path already existed when making a symbolic link.
- Fixed an issue where the `link` command would crash if unlinking a directory that was not a symbolic link.
- Fixed an issue where the `link` command would allow the hard linking of directories, which would always cause an incorrect permission error.
- Fixed an issue where the `sysinfo` command would print the CPU speed twice on some systems.
- Fixed an issue where the description of the non-fatal error in the `crash` command described it as a fatal error.
- Fixed an issue where the BubbleOS name was hardcoded in some areas.
- Fixed an issue where the _terminating BubbleOS process_ text in the fatal error was no longer bolded.
- Slightly changed the error message in the `crash` command.

### Removed Features

- Removed the ability for the following commands to run in the pre-boot interpreter: `cd`, `exit`, `history`, `setmgr`, and `tips`.
- Removed the `-c` argument from the `symlink` command. To check if a path is a symbolic link, simply enter one path.
- Removed the `-u` (and `-y`, as a side-effect) arguments from the `link` command. To unlink a link or symbolic link, use the `del` command.
- Removed the `--sh` argument from the `exec` command, due to it being slower and unsafe (allowed command injection), and the `-h` argument.

## Build 200 RC2 to 200 RC3 (v2.0.0-rc2 to v2.0.0-rc3)

### Added Features

- Added the non-fatal error, which occurs when BubbleOS encounters an error that it can recover from. The fatal error still occurs when a critical component crashes. Note that the non-fatal error still shows a bug in BubbleOS, like the fatal error, and should be reported. The difference is that it does not end the BubbleOS process.
- Added compatibility for release candidates to the update checker.
- Added the time of crash to the fatal error information file.

### Changed/Fixed Features

- Changed the requirement for entering the 'all' keyword in `hash` to show all hashes; now to show all hashes, nothing has to be entered.
- Fixed an issue where some commands would crash when interacting with files ([#17](https://github.com/arnavt78/bubbleos/issues/17)).
- Fixed an issue where the `symlink` command would crash when attempting to create a symbolic link.
- Fixed an issue where the `symlink` command would crash if the target path and source were the same.
- Fixed an issue where the `copy` command would crash when copying a file/directory to a subdirectory of itself.
- Fixed an issue where the absolute path verbose message would always show _undefined_.
- Fixed an issue where the help message for the `history` command would not show information about the `-c` argument.
- Fixed an inconsistency issue where the fatal error information file would not have leading zeros in the date.

### Removed Features

- Removed the `--no-intro` flag from the BubbleOS executable.

## Build 200 RC1 to 200 RC2 (v2.0.0-rc1 to v2.0.0-rc2)

### Added Features

- Added safeguards against renaming the BubbleOS configuration file using `rename`, to prevent BubbleOS from thinking the file was deleted.
- Added a message for the first introduction of BubbleOS to inform how to change the settings.

### Changed/Fixed Features

- The `rename` command now keeps the directory in its original location when renaming it. Previously, if the new name didn’t include a directory, the command would move the renamed directory to the current working directory. Now, it updates the name without changing its location.
- Updated the confirmation and success messages in the `taskkill` command to display the process name instead of the PID when using the PID.
- Changed the timeout in the `ping` command from 10 seconds to 5 seconds.
- Fixed a formatting error in the `ping` command where the success code would not have an closing bracket.
- Fixed an issue where BubbleOS would crash upon encountering the `ENXIO` error.
- Fixed an issue where the `taskkill` command would detect if the process did not exist after the confirmation prompt was accepted when using PIDs.
- Fixed an issue where the `taskkill` command would crash BubbleOS when it successfully killed a process.
- Fixed an issue where the `cd` command would count the tilde (`~`) as valid if it was anywhere in the path, instead of the first character.
- Fixed an issue where the configuration file version checker would fail to detect an upgrade in some cases.
- Fixed an issue where the version in the configuration file would not update if the configuration file did not require a reset.

### Removed Features

_No removed features._

## Build 199 to 200 RC1 (v1.9.9-beta to v2.0.0-rc1)

### Added Features

- Added alphabetized sorting to the settings in the `setmgr` command.
- Added compatibility to BubbleOS for release candidates.

### Changed/Fixed Features

- Fixed an issue where loading an older version of the BubbleOS configuration file would cause a corruption error.
- Fixed an issue where running `cd` (in some cases) or `copy` would crash BubbleOS.
- Fixed an issue where the _process aborted_ message would not appear after declining the `exit` confirmation prompt.
- Fixed an issue where the message prefix label would not appear on the timeout error message in the `ping` command.
- Fixed an issue where a file operation would rarely crash BubbleOS with an `UNKNOWN` error code.
- Fixed an issue where the `stat` command would sometimes crash when getting information of a path.

### Removed Features

- Removed the ability to run `cd -` to enter the last directory. This may be reintroduced in a future version.

## Build 198 to 199 (v1.9.8-beta to v1.9.9-beta)

### Added Features

- Added a welcome message that appears when launching BubbleOS for the first time.
- Added the ability to silence most success messages (customizable using `setmgr`).

### Changed/Fixed Features

- Changed the timeout in the `ping` command from 15 seconds to 10 seconds.
- Made the startup corrupted configuration file error message not appear when the configuration file does not exist.
- Made it less likely for BubbleOS to allow starting up with a corrupted configuration file without resetting it.
- BubbleOS now checks if the configuration file is corrupted after a command executes.
- Fixed an issue where pressing Ctrl+C while having exit prompts enabled would cause BubbleOS to freeze if "no" was entered.
- Fixed an issue where pressing Ctrl+C while a command was executing would not exit BubbleOS, and freeze the shell instead.
- Fixed an issue where pressing Ctrl+C while on the prompt in `mkfile` would crash BubbleOS.

### Removed Features

- Removed the silence (usually `-s`) flags from most commands in favor of the setting in `setmgr`.
- The `history` command will no longer attempt to reset the configuration file upon an error occurring.

## Build 180 to 198 (v1.8.0-beta to v1.9.8-beta)

### Added Features

- Added the `setmgr` command, which allows changing a variety of BubbleOS settings.
- Added the `stat` command, which displays information about a file or directory, including the location, size, created, modified, and accessed dates.
- Added an update checker, which checks for updates weekly when BubbleOS starts (customizable using `setmgr`).
- Added the ability to show either the full path or just the file/directory name in success/error messages in commands (customizable using `setmgr`).
- Added the ability to show or remove the version when starting BubbleOS (customizable using `setmgr`).
- Added the ability to hide the prefix labels on success, info, warning and error messages (customizable using `setmgr`).
- Added the ability to show a confirmation prompt before exiting BubbleOS (customizable using `setmgr`).
- Added new tips for the `tips` command to display.
- Added the ability for BubbleOS to reset the configuration file when needed if it detects an older version.
- Added CPU information to the `sysinfo` command, which shows the name and speed of CPUs in the system.
- Added the ability to change to the last directory using `cd -`.
- Completely overhauled the BubbleOS command input prompt internally, allowing it to catch Ctrl+C keypresses on the prompt to exit the shell gracefully.
- Added a list selection prompt to the `crash` command.
- Added the ability to use double-quotes to enter a task name with spaces in `taskkill`.
- Added better error handling to the `ping` command, to reduce the chance of encountering a fatal error.
- Added the `pwd` command as an alias to `cwd`.
- Internally moved all help messages, tips, and crashes to JSON files.
- Internally added multiple classes and function files.

### Changed/Fixed Features

- The `fif` command will no longer accept blank responses.
- Made the occurrence location numbers in the `fif` command no longer show up by default (use the `-p` argument to show them).
- Changed the `date` command to show the slash-format date in the format _{month}/{day}_ and no longer made it italicized.
- Changed the formatting of the date in the `date` command and the intro for the timebomb to add trailing zeros.
- Changed the formatting of the `time` command so that it will no longer be bolded.
- Edited almost all help messages, error messages, and verbose messages.
- BubbleOS now gracefully terminates when receiving a `SIGTERM` or `SIGINT` code.
- Fixed an old issue where commands had to be in all lowercase to be recognized (this can be changed with the `setmgr` command).
- Fixed an issue where running `lock` on some Linux systems would cause BubbleOS to crash ([#11](https://github.com/arnavt78/bubbleos/issues/11)).
- Fixed an issue where commands that required a path, such as `del`, `cd`, and `readfile`, would crash if the path was not passed on some systems.
- Fixed an issue where permission errors would crash BubbleOS with a fatal error on macOS and Linux systems in most commands.
- Fixed an issue where the `ping` command would show the "timed out" error once the request was completed after a few seconds, causing BubbleOS to hang. This only occurred on some systems.
- Fixed an issue where the `ping` command would hang BubbleOS if the status code was 200 or the server timed out. BubbleOS would also terminate if the status code was not 200.
- Fixed an issue where the `ping` command would fail to locate the address if it began with _https://_ or _http://_.
- Fixed an issue where resetting the configuration file would cause the `history` command to throw a corrupted configuration file error.
- Fixed an issue where the `taskkill` command would not output an error message if the process did not exist when specifying the process name rather than the PID.
- Fixed an issue where the `ls` command would crash BubbleOS if it did not have permission to read the directory.
- Fixed an issue where commands would not recognize the '~' character as the home directory in Linux and macOS.
- Fixed an issue where "hard aliases" would show as not recognized in the `help` command, despite them working in the BubbleOS CLI.
- Fixed an issue where the battery percentage would sometimes show as `NaN%` if the device does not have a battery (mainly affected Windows devices).
- Fixed an issue where the `cd` and `ls` commands would rarely crash BubbleOS if the directory did not exist.
- Fixed an issue where the `crash` command would crash BubbleOS with a fatal error when crashing Windows with a BSOD if the Windows `taskkill` command didn't exist or was blocked by the system.
- Fixed an inconsistency in the `ls` command where the error message would not show the full directory path.
- Fixed an issue where the `ifnet` command had no verbose messages.
- Fixed multiple spelling errors.
- The license now displays as 2022-_'current year'_.
- Internally moved the `cwd` command to a separate file and fixed an issue where it had no verbose messages.
- Internally added, edited and removed comments.

### Removed Features

- Removed the `size` command, in favor of the `stat` command.
- Removed the `--kill-self` argument for the `taskkill` command. BubbleOS now allows killing its process by default.
- Removed the ability to use the up-arrow key to cycle through previous commands, however, this functionality was broken on Linux and macOS (and in some cases, in Windows). This may be reintroduced in a future version.
- Removed the leniency of yes/no prompts, so that only _y_ or _yes_ are accepted. This may be reintroduced in a future version.
- Removed an Easter egg :(
- Removed the codes at the end of some error messages.
- Removed four unused error messages.
- Removed the CPU endianness from the `sysinfo` command.
- Removed the BubbleOS PID from showing in the fatal error screen.
- Removed the tip from showing in the `sysinfo` command at all.
- Internally removed the `helpMessages.js` file, in favor of the `helpMsgs.json` file.
- Internally removed the `caseSensitivePath`, `convertAbsolute`, and `parseDoubleQuotes` functions in favor of the `PathUtil` class.

## Build 167 to 180 (v1.6.7-beta to v1.8.0-beta)

### Added Features

- Added the ability to kill processes by specifying the process name instead of the PID in `taskkill` (PIDs are still supported).
- The `sysinfo` command now displays the battery percentage and if the battery is on charge, if the device has a battery.
- Added an option to crash the device with a Blue Screen of Death on Windows using the `crash` command. **This is a very dangerous option!**
- Added safeguards against deleting the BubbleOS configuration file.
- Added a check to see if BubbleOS crashed the last time it ran. If it did, a warning message will show on startup.
- Added a startup check to make sure the terminal supports color. If not, BubbleOS will end prematurely.

### Changed/Fixed Features

- Improved the selection algorithm of the `tips` command, so that it is impossible to fail finding a tip, and when there are no more tips to show, it will reset automatically.
- The color for memory in `sysinfo` now has yellow text for if the memory usage is around the middle.
- The information in the `sysinfo` command now shows bolded instead of italicized.
- Increased the timeout time in the `ping` command from 5 seconds to 15 seconds.
- Fixed an issue where the `ping` command would crash BubbleOS if the status code returned was not 200, and also if the connection to the address was refused.
- Fixed an issue where the `ping` command would sometimes show _undefined_.
- Fixed an issue where using the `dirtree` command would crash BubbleOS.
- Fixed an issue where clearing the history would cause the next `history` command usage to give a corrupted configuration file error.
- Fixed an issue where running BubbleOS with an incorrectly-cased path as the CWD would show that in BubbleOS.
- Fixed an issue where the `bub` command would not show the command being executed if it was the `exit` command or the `bub` command running the same file.
- Fixed an issue where changing the directory in a `.bub` file would keep its changes after it was done executing.
- Fixed a consistency issue where the user information had its values bolded instead of italicized in the `sysinfo` command.
- Internally removed the usage of a deprecated function in code.

### Removed Features

_No removed features._

## Build 148 to 167 (v1.4.8-beta to v1.6.7-beta)

### Added Features

- The verbose feature has been fully implemented. Unlike previous versions, the verbose flag can only be used on the BubbleOS executable itself, by running it with the `--verbose` flag.
- If the specified file/directory exists when running `mkfile`/`mkdir`, BubbleOS will ask whether or not to delete the file/directory instead of failing.
- BubbleOS will no longer display the full intro after opening on the system once to reduce clutter.
- Added the `-h`/`--help` flag to the BubbleOS executable, which displays all the BubbleOS startup arguments and what they do.
- Added the `--reset` flag to the BubbleOS executable, which resets the configuration file.
- Added the ability to use double quotes in the `tasklist` command.
- Internally added the `InfoMessages` and `ConfigManager` classes.

### Changed/Fixed Features

- The _"this may take a while"_ message in `copy` will no longer display unless the file/directory exceeds 250MB.
- Many success, information, warning, and error messages are updated to the new style.
- The `sysinfo` command will no longer display the tip after the first time it shows.
- Fixed an issue where the `cd` command would not be case-sensitive on Windows, as well as other commands ([#15](https://github.com/arnavt78/bubbleos/issues/15)).
- Fixed an issue where the `ping` and `tasklist` commands would fail to execute in the pre-boot interpreter.
- Fixed an issue where the `bub` command would be caught in an infinite loop if the `.bub` file was executing the same file as it was running.
- Fixed an issue where commands executing in a `.bub` file would be added to the command history.
- Fixed an issue where the `ping` and `tasklist` commands would fail to execute in a `.bub` file.
- Fixed an issue where BubbleOS would crash if it could not save a command to history in the configuration file, or read the history. If it encounters an error reading the file, it will now automatically reset the file and not crash BubbleOS.
- Fixed an issue where BubbleOS would crash when encountering an inaccessible directory in `dirtree`.
- Fixed an issue where changing the directory using the `cd` command into a symbolic link would not show where it pointed to in the success message.
- Fixed an issue where arguments entered for a command in the pre-boot interpreter would not work.
- Significantly improved performance of the `help` command.
- Entering nothing into the `hash` command will show all hashes instead of throwing an error.
- Changed the tip in the `help` command.
- The "timebomb disabled" warning on startup will only display if the system time exceeds the expiry date.
- The display of commands running in `bub` is no longer italicized.
- The error info file saved when a fatal error occurs is now called `BUBBLE_ERROR_INFO.TXT`.
- Improved maintainability of the `index.js` file and moved other startup processes to their dedicated file internally.
- Internally updated and removed various comments in the code.
- Internally renamed `historyCmd` function to `history`.

### Removed Features

- BubbleOS no longer supports UNC paths and will give an error if an operation is attempted with them.
- Removed the hidden `--debug` argument from the `tips` command.
- Removed the ability to enter an index into the `crash` command.
- Removed the confirmation dialog for the `ifnet` command.
- Removed the `--rm-tip` flag for the `sysinfo` command, since it is now managed automatically.
- Removed the `--no-tip` flag for the `help` command.
- Internally removed the `_replaceSpaces` function, since it is now unused.

## Build 135 to 148 (v1.3.5-beta to v1.4.8-beta)

### HOTFIX!

- Fixed an issue where running the `cls` and `exit` commands would crash BubbleOS, and in some cases in the `cd` command ([#14](https://github.com/arnavt78/bubbleos/issues/14)).

### Added Features

- The BubbleOS configuration file is now used to store command history across sessions.
- The `size` command can now get the size of a directory, and can now accept directory paths as a valid argument.
- Added a new text editor for the `mkfile` command to make it more user-friendly, featuring a multi-line editor to easily make new files without using the `*n` keyword for newlines.
- Internally added new verbose messages. These are currently unused in the code and will be introduced fully in the next version.

### Changed/Fixed Features

- The history in the configuration file is no longer saved and overwritten only when the `exit` command is run. Instead, the command will be saved every time the user inputs one.
- The `size` command will now automatically choose the best size to show (e.g. 6 GB over 6,000 MB).
- Updated the size conversion of BubbleOS to use correct conversion factors to follow the binary convention.
- Made commands by default not display in the `bub` command when executing a file.
- Updated help messages for commands to fix various grammar issues and other information.
- Fixed an issue where the time would display without a preceding 0 if the seconds/minutes was a single digit in the `time` command, fatal error file, and verbose messages.
- Fixed an issue where running the `size` command would crash BubbleOS.
- Fixed an issue where entering any value in a yes/no prompt would always abort the process after answering, even if "yes" was entered ([#10](https://github.com/arnavt78/bubbleos/issues/10)).
- Fixed an issue where entering the `echo` command would crash BubbleOS ([#12](https://github.com/arnavt78/bubbleos/issues/12)).
- Fixed an issue where if the error file was unable to be saved when a fatal error occurred, a fatal error would occur inside of the fatal error.
- Fixed an issue where BubbleOS would allow the `taskkill` command to kill itself, even when the `--kill-self` flag was not passed.
- Updated GitHub links to the new transfered repository.

### Removed Features

- Removed the arguments for the `size` command, as it now automatically chooses the best size to show. This may come back in a future version.
- Removed the ability to enter newlines in the `fif` search, due to it not functioning in the first place.
- Removed the `history` variable due to it now being stored in a separate file so that it can be used between sessions.

## Build 131 to 135 (v1.3.1-beta to v1.3.5-beta)

### Added Features

- Commands now have "hard aliases", which means typing in an alias will automatically run it instead of failing (e.g. `dir` runs the `ls` command). More will be added in future versions.

### Changed/Fixed Features

- Fixed an issue where running the `fif` command would crash BubbleOS.
- Updated heading color in the `fif` command to easily differentiate it.
- Changed the version text when running `-v` on the Bubble executable to be more consistent.
- When a fatal error completes, the user will be prompted to press the Enter key so that they can read the error.
- Changed key required to be pressed in the startup error from any key to just the Enter key, due to a previous unfixable bug.
- It is now less likely to get an unformatted error rather than a fatal error.

### Removed Features

- Removed some Easter eggs and references to Erik and B-Kernel due to less involvement in the project (but they will always be remembered ❤️).

## Build 125 to 131 (v1.2.5-beta to v1.3.1-beta)

### Added Features

- Added the `dirtree` command, which visually shows a directory tree of the folder specified and the files inside.
- The `ping` command will now follow redirects up to five times (after which it will fail with an error due to too many redirects).

### Changed/Fixed Features

- Updated the fatal error screen text and other related processes (e.g. the heap snapshot is no longer saved upon crashing).
- Fixed an issue where BubbleOS would report Windows 11 devices as Windows 10 in `sysinfo` ([#7](https://github.com/arnavt78/bubbleos/issues/7)).
- The `print` command no longer outputs an error message when entering nothing, it just shows nothing.
- Fixed multiple issues in the `ping` command, making it work more consistently.
- Internally improved the code of `ifnet`.
- Moved HTTP codes and messages to a separate JSON file internally.

### Removed Features

- Internally removed unused code in the `Errors` class.

## Build 122 to 125 (v1.2.2-beta to v1.2.5-beta)

### Added Features

_No added features._

### Changed/Fixed Features

- Fixed an issue in the configuration creation which caused the "Failed to create configuration file" error on boot.
- Changed clear screen statements internally.

### Removed Features

- Removed the ability to use slashes (`/`) for arguments in commands and launching BubbleOS.

## Build 116 to 122 (v1.1.6-beta to v1.2.2-beta)

HAPPY APRIL FOOLS!!! XD

### Added Features

- Added the `-u` flag to `sysinfo`, which displays user information. It also displays it by default.
- Added the `link` command, which creates [hard links](https://learn.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions) on the system.
- Added the `lock` command, which locks the system. Works on Windows, macOS, and Linux.
- Added an internal feature that creates a configuration file for BubbleOS to use. However, it currently is not used, and there is a bug which will say that BubbleOS failed to create the file, even if it was successfully created.

### Changed/Fixed Features

- Changed the yes/no prompt to accept more lenient answers such as typos.
- Fixed an issue where the `ls` command, by default, could not read out of the CWD if it had spaces.
- Fixed an issue where the pre-boot interpreter would not run some commands (e.g. `ping`).

### Removed Features

- Removed the `userinfo` command.

## Build 112 to 116 (v1.1.2-beta to v1.1.6-beta)

### Added Features

- Added a feature where you can change into a symbolic link directory in BubbleOS using the `cd` command.
- Added the full operating name in the `sysinfo` command.
- Added a feature where the `symlink` command, if run with the `-c` flag and if the path was a symbolic link, will show the path it points to. Colors have also been updated for it.
- Added help messages for commands such as `hash`, `ping`, and `tasklist`.

### Changed/Fixed Features

- Updated error handing on the `ping` command.
- Fixed an issue where the `symlink` command would crash BubbleOS upon running it.
- Fixed an issue where the `tasklist` command would crash BubbleOS when run in the executable version.
- Changed the text that displays when running `bubble -v`.
- Fixed an issue where `mkfile` would crash when attempting to ask the user for file contents.
- Fixed an issue where BubbleOS would count ARM64 devices as an invalid architecture.

### Removed Features

_No removed features._

## Build 108 to 112 (v1.0.8-beta to v1.1.2-beta)

### Added Features

- Added the `hash` command, which can check hashes for files.
- Added the double-quote interpreter for paths in all commands.
- Added a check which will check if BubbleOS is not running on a x64 device and/or Windows 8.1 and below. If either are true, BubbleOS will crash on startup. This can be disabled by using the `--no-checks` flag (at your own risk).
- Added a beep sound which will sound when a fatal error occurs.
- Added the BubbleOS PID to the fatal error technical information (but not to the dump file).

### Changed/Fixed Features

- Changed the text in the fatal error.
- Fixed an issue where the command interpreter would classify commands such as `clsls` to be correct, for example (as it starts with a valid command, `cls`).
- Fixed an issue where entering nothing in some commands would result in BubbleOS crashing.

### Removed Features

_No removed features._

## Build 100 to 108 (v1.0.0 to v1.0.8-beta)

### Added Features

- Added the ability to use double quotes to specify paths with spaces in commands, instead of the `*s` keyword. Currently only available on `cd` and `copy`.
- Added help aliases that will appear if you enter in a command that doesn't exist, but has an alias.
- BubbleOS will not check if it is running with elevated privileges, and if so, it will display a warning at startup.
- Added the `tasklist` command, which shows all running processes and their respective PID.
- Added the `ping` command, which sends a request to a specified server.
- Added a confirmation prompt for display network interfaces in `ifnet`. (Also a small Easter egg relating to it!)

### Changed/Fixed Features

- Fixed an issue where the entire command entered would show as 'not recognized'.
- Updated the cancellation message from '_Operation cancelled._' to '_Process aborted._'.
- Fixed an issue where if invalid characters were entered in `taskkill`, in the error, it will show the received text as `NaN`.

### Removed Features

- Removed the _no command_ error.
- Internally removed the `TIMEBOMB_COUNT` variable.

## Build 98-100 (v0.9.8-v1.0.0)

**This is a stable release of BubbleOS!**

### Added Features

- Added a prompt for the phrase to find in the `fif` command.
- Added the `--no-intro` flag to the BubbleOS executable, which disables the intro at startup.

### Changed/Fixed Features

- Fixed an issue where characters such as `?` or `:` would crash BubbleOS when entered in `fif`.
- Fixed an issue where the `fif` command did a case-insensitive search.
- Updated the tips in the `tips` command.
- Changed the structure of dates from _{day}/{month}_ to _{month}/{day}_.
- Corrected some spelling mistakes in BubbleOS.

### Removed Features

- Removed the 'phrase' argument in the `fif` comamnd.

## Build 84-98 (v0.8.4-v0.9.8)

_Note: This is the last beta build, and thus has lots of bug fixes and features, but no new commands have been introduced._

### Added Features

- Added more information to the `fif` command, including a occurrence viewer.
- Added the `-s` flag to many commands, which silences all success messages to _stdout_, except for error messages.
- Added a feature to the `exec` command, where it can execute files as well as executables with their respective default viewer.
- Added tips to the `tips` command.
- Added a lot of information to the `sysinfo` command, including system resources, advanced information, and arguments.
- Added the `--no-dump` flag to the main BubbleOS executable, which will disable file dumping in the case a fatal error occurs.
- Added an optional argument to `crash` where you can enter the index of the way you want to crash BubbleOS.
- Added the ability to create parent directories in `mkdir` if they do not exist.
- Added a feature where the `readfile` command has certain character limits.
- Added a twelve-hour clock to the `time` command (however, it can be switched by using the `-24` flag).
- Added flags to the `exec` command such as `-h` and `--sh`.
- Added a friendly-style date in `date`, like so: _{day}, the {date} of {month} {year}_.
- The `ls` command now will print the short version (`-s`) in sorted rows, of which size will change depending on the length of the name of the largest file/folder.
- The `copy` and `rename` commands will now warn you if the destination already exists (only if the destination exists).
- Added startup warnings for dangerous BubbleOS flags such as `--no-timebomb`. These can be disabled using the `--no-warnings` flag.
- Added 'lines' and 'characters excluding whitespace' properties in the `wcount` command. Also, you can filter it using arguments.
- Added a safeguard against killing the BubbleOS process in `taskkill`. However, this can be ignored by using the `--kill-self` flag.
- Added the user temporary path to the `userinfo` command.
- Added the `-c` flag to the `exit` command, which exits BubbleOS, and then clears the screen.

### Changed/Fixed Features

- Fixed an issue where the `cwd` command was unrecognized.
- Fixed an issue where `taskkill` would crash BubbleOS if the PID didn't exist.
- Fixed an issue where `symlink` would crash if the path didn't exist when the `-c` argument was passed.
- Fixed an issue where the confirmation prompt would have '_y/n_' uncolored.
- Updated many success messages in commands.
- Changed the space character from `/s` to `*s` due to issues with Linux and macOS systems.
- Fixed an issue where the `print` command wouldn't output anything after a space.
- Fixed an issue where the pre-boot interpreter would crash BubbleOS.
- Fixed an issue where `mkfile` would crash if a directory passed in didn't exist.
- Fixed an issue where characters such as `*` or `+` would crash BubbleOS if entered.
- Renamed the `-r` flag in `sysinfo` to `-s` (system resources filter flag).
- Fixed an issue where the `bub` command would report plain text files as an '_invalid encoding_'. Also, if the file didn't end with `.bub`, BubbleOS would crash.
- Internally renamed `aboutConsts.js` to `constants.js`.

### Removed Features

- BubbleOS will not longer automatically add `.bub` to the end of a file when running `bub`.
- Removed the need to add the `--sizes=` flag to the `size` command. Instead, use separate arguments.
- Removed the `prompt.js`, `mainArgs.js` and `multiParam.js` files internally.

## Build 78-84 (v0.7.8-v0.8.4)

### Added Features

- Added the `crash` command, which crashes BubbleOS (and your computer ;) ) in multiple different ways!
- Added a memory dump to the fatal error, as well as a heap snapshot and saved error files.
- Added more reuseable verbose messages to more command.
- Added a new `-s` flag for the `cd` command, which silences all outputs to _stdout_ (except verbose and error messages).
- Added new error codes (e.g. `NON_EXISTANT_PATH`).
- Added another Easter egg!

### Changed/Fixed Features

- The `crash` command will now leak more memory than before.
- Changed the confirmation prompt to automatically enter when you press a key.
- Fixed an issue where BubbleOS would crash when using `mkfile`/`mkdir` if the path exceeded `MAX_PATH`.
- Fixed an issue where making a directory/file with invalid characters would crash BubbleOS.
- BubbleOS will now crash with a fatal error if the timebomb has expired, after displaying a message.
- Fixed an issue where running `bub` would crash BubbleOS (it was a simple typo).

### Removed Features

- Removed the `--kill` flag (use the `crash` command instead).
- Removed the Discord server link in `about` as the server was deleted.

## Build 75-78 (v0.7.5-v0.7.8)

### Added Features

- Combined the `copyfile` and `copydir` commands into the `copy` command.
- Added an Easter Egg in the `about` command :)
- Added the `-v`/`--version` flag to BubbleOS to display the version of it (e.g. `bubble.exe -v`).
- Added the `--kill` flag to BubbleOS, which crashes it at startup. **ONLY TO BE USED FOR TESTING PURPOSES!**

### Changed/Fixed Features

_No features have been changed/fixed in this release._

### Removed Features

- Removed the `copyfile` and `copydir` commands in favor of the `copy` command.

## Build 69-75 (v0.6.9-v0.7.5)

### Added Features

- Added the `copydir` command, which copies the entire directory structure.
- Added a function in the `symlink` command which creates a [symbolic link](https://en.wikipedia.org/wiki/Symbolic_link) (you can use `-c` to check if it is a symbolic link).
- Added the ability to use the `-y` flag on the `del` command to skip the confirmation prompt.
- Added a timebomb to BubbleOS. However, it can be ignored by running BubbleOS with the `--no-timebomb` flag.
- Added more information to the `help` command.
- The `ls` command will now recognize symbolic files/folders and color them accordingly (red).

### Changed/Fixed Features

- Fixed a major issue (which was present ever since the command was first available) where the `cls` command would not clear the _entire_ screen, but just the contents displayed.
- Fixed an issue where `bub` would crash with a `FATAL ERROR`.
- Renamed the `symblnk` command to `symlink`.
- Changed the underlying code of interpretting commands to make it faster.

### Removed Features

- Removed the `_prepVerbose` function internally.
- Removed the `_singleParam` function internally.

## Build 63-69 (v0.6.3-v0.6.9)

### Added Features

- Added the `symblnk` comamnd, which checks if a path is a [symbolic link](https://en.wikipedia.org/wiki/Symbolic_link).
- Added the `tips` command (however, there are no tips currently).
- Added a new `Errors` class internally to make error messages streamlined.
- Added more error messages, and replaced placeholder ones. Also added a technical error code at the end of some errors.
- Added a thanks to Erik and B-Kernel in the `about` command.
- Added the BubbleOS Discord server link in the `about` command.

### Changed/Fixed Features

- Fixed an issue where Linux and macOS could not read files/directories.
- Updated the errors' internal code and messages.
- Updated the _FATAL ERROR_ screen to include more technical information.
- Fixed an issue where on some systems, BubbleOS could not be run successfully (crash on startup).
- Fixed an issue where the `bub` command would crash BubbleOS.
- Fixed an issue where the `help` command would crash BubbleOS.

### Removed Features

- Removed the `ERRORS` variable and the `errorInt` function.

## Build 55-63 (v0.5.5-v0.6.3)

### Added Features

- Added the `bub` command, which can interpret BubbleOS commands line-by-line in a file, similar to a `.bat`/`.cmd` file. You can also run it with the `-d` flag to show the commands that it is executing.
- Added a pre-boot interpreter, which can execute one command when run (for example, `bubble.exe mkdir test`). It will exit as soon as the command has executed.
- Seperated the `time` and `date` commands, adding two seperate ones (**not** aliases).
- Added the `-s`/`/s` flag for the `ls` command to display folder contents in a shorter view.

### Changed/Fixed Features

- Edited some error messages.
- Fixed an issue where viewing the license using `about -l` would sometimes show as nothing on a low-color _stdout_.
- Made the year/name of the license in `about` dynamic.
- Made underlying code of `ls` reuseable.

### Removed Features

_No features have been removed in this release._

## Build 52-55 (v0.5.2-v0.5.5)

### Added Features

- Added the `-l`/`/l` flag for the `about` command to display the MIT license.
- Added the `/verbose` flag alongside the `--verbose` flag.
- Added the verbose option for the `copyfile` command.

### Changed/Fixed Features

- Changed error codes dramatically; they are now reused and only 12 are available to make it easier to troubleshoot.
- Fixed an issue where `ls` would crash BubbleOS with a `FATAL ERROR` if a file was passed.
- Changed a few error messages to warning messages.

### Removed Features

- Removed lots of error codes (around 50-60) and messages.

## Build 48-52 (v0.4.8-v0.5.2)

### Added Features

- Added the `ifnet` command, which returns all network interfaces and information about them running on your computer.
- Added the `cwd` command, which returns the current working directory.
- Added the `--verbose` flag for the `cd` command again, but it has changed (e.g. messages)!
- Added the ability to use `/s` to use any file/directory that contains spaces.

### Changed/Fixed Features

- Changed the way the OS displays in `sysinfo` to be more user-friendly.
- Changed the intro; added the build number and removed the year.
- Changed the way error messages display (from `Error code 1` to `[1]`).

### Removed Features

_No features have been removed in this release._

## Build 43-48 (v0.4.3-v0.4.8)

### Added Features

- Added the `fif` (find in file) command.
- Added a fatal error screen which will occur when there is an unknown/unhandled exception.
- Added a beta software disclaimer.
- Made the _BubbleOS_ name universally changeable from a single variable, as well as others including the author, version, and the beta state.

### Changed/Fixed Features

- Changed error codes (from a `0x00--` style to `--` style, e.g. `0x0078` would be `78`), and error messages.
- Changed the number of historical stores from 20 to 50.
- Fixed a major bug where `ls` would not read out of the current working directory.
- Fixed a major issue in the `cd` command where it would crash the entire shell if no argument was passed.

### Removed Features

- Removed the `constants.js` file and relocated/recoded the `DEFINITIONS` and `ERROR_MESSAGES` objects.
- Removed the `--verbose` flag ability for the `cd` and `ls` commands temporarily (help documentation for it still exists).

## Build 39-43 (v0.3.9-v0.4.3)

### Added Features

- Added the `--size=(sizes)` flag for the `size` command.
- Added the `history` command.
- Added the `--verbose` flag for the `ls` command.

### Changed/Fixed Features

- Increased decimal places for the `size` command from _2_ to _4_.
- Changed file structure slightly (moved `variables` into `src`).

### Removed Features

- Removed the file `variables.js`.
- Removed the file `error.js`.
- Removed the `RECOGNIZED_COMMANDS` variable.

## Build 35-39 (v0.3.5-v0.3.9)

### Added Features

- Added verbose status messages for the `cd` command. More are coming for later versions.
- Added the `time` and `date` command (both are aliases).
- Added the `rename` command.
- Added the `size` command.
- Extracted absolute path convertion into a seperate function: `_convertAbsolute`.

### Changed/Fixed Features

_No features have been changed/fixed in this release._

### Removed Features

- Deprecated the `date` variable.

## Build 27-35 (v0.2.7-v0.3.5)

### Added

- Added the `del` command in place of `rmdir` and `rmfile`.
- Added the `wcount` command.
- Added the `print` command.
- Added the `userinfo` command.
- _Tried to add the `tasklist` command, but it didn't work, so I had to remove it :(_

### Changed

- Updated error codes and error messages.
- Changed the name of the OS from BubbleOS Lite to BubbleOS.

### Removed

- Removed the `rmdir` and `rmfile` commands in favor for the `del` command.

## Build 23-27 (v0.2.3-v0.2.7)

### Added

- Added alphabetised sorting for the `help` command.
- Added better validation for the PID for `taskkill`.
- Added help information for the `cls` command.
- Added error codes.
- Extracted argument repition into seperate function `_singleParam`.
- Added `CHANGELOG.md`.
- A few more minor Easter Eggs.

### Changed

- Fixed an issue where `rmdir` crashes `explorer.exe` on Windows sometimes.
- Fixed an issue which would cause terminal characters to temporarily be corrupted when reading a non-UTF-8 file with `readfile` (the functionality to read binaries has been removed).
- Fixed an issue where `ls` would crash BubbleOS entirely if the directory was invalid.
- Updated the `error` function to make it more reuseable and lightweight.
- Updated `cd` command to handle no directories.
- Improved code reusability.

### Removed

- Deprecated the `RECOGNIZED_COMMANDS` constant.
