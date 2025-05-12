const chalk = require("chalk");

const { GLOBAL_NAME, AUTHOR, VERSION, BUILD } = require("../../variables/constants");

const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

/**
 * The `about` command. Displays information about BubbleOS.
 *
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const about = (...args) => {
  try {
    Verbose.initArgs();
    const license = args.includes("-l");
    const binary = args.includes("--ilovetech");

    // For the Easter egg :)
    let aboutName = binary
      ? "01000010 01110101 01100010 01100010 01101100 01100101 01001111 01010011"
      : GLOBAL_NAME;

    // Title
    Verbose.custom("Displaying information...");
    console.log(chalk.underline.bold.red(`About ${aboutName}\n`));

    // Information about build and author
    console.log(chalk.bold(`${aboutName}, v${VERSION} (Build ${BUILD})`));
    console.log(`Made by ${AUTHOR}!\n`);

    // MIT License (variable year)
    if (license) {
      Verbose.custom("Displaying license...");
      console.log(
        chalk.dim(`    MIT License

    Copyright (c) 2022-${new Date().getFullYear()} ${aboutName}
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.\n`)
      );
    }

    // Links
    console.log(`GitHub: ${chalk.underline.blueBright("https://github.com/viradex/bubbleos")}`);
    console.log(`YouTube: ${chalk.underline.blueBright("https://youtube.com/InfiniTech78")}\n`);
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = about;
