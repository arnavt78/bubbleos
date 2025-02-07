const chalk = require("chalk");
const https = require("https");

const HTTP_CODES_AND_MESSAGES = require("../data/httpCodes.json");

const _fatalError = require("../functions/fatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

const _makeConnection = async (host, path = "", maxRedirects = 5) => {
  const options = {
    host,
    path,
    timeout: 15000,
    method: "HEAD", // HEAD request to only fetch headers
    rejectUnauthorized: true,
  };

  Verbose.custom("Creating formatted URL...");
  const formattedURL = (options.host + options.path).replace(/^www\.|\/+$/g, "");

  // The reason resolve() is used everywhere is because if
  // reject() is used, BubbleOS will crash
  return new Promise((resolve, reject) => {
    Verbose.custom("Creating new request...");
    const req = https.request(options, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        const location = res.headers.location;
        if (location) {
          if (maxRedirects > 0) {
            Verbose.custom(`Redirected to: ${location}. Following the redirect...\n`);

            // Parse the new URL and recursively call _makeConnection
            Verbose.custom("Parsing URL and following any redirects...");
            const url = new URL(
              location.startsWith("http") ? location : `https://${host}${location}`
            );
            _makeConnection(url.hostname, url.pathname + url.search, maxRedirects - 1)
              .then(resolve)
              .catch(reject);
          } else {
            Verbose.custom("Encountered too many redirects.");
            InfoMessages.error(
              `Too many redirects. Stopped following after ${5 - maxRedirects} redirects.`
            );
            resolve();
          }
        } else {
          Verbose.custom("Encountered a redirect without a Location header...");
          InfoMessages.error(
            `Redirect received, but no Location header found. Status code: ${res.statusCode}.`
          );
          resolve();
        }
      } else if (res.statusCode === 200) {
        Verbose.custom("The server is responding with status code 200.");
        console.log(
          chalk.green(
            `The server, ${chalk.bold.italic(
              formattedURL
            )}, is responding with status code 200 (OK)!\n`
          )
        );
        resolve();
      } else {
        Verbose.custom("The server is not responding with status code 200.");
        console.log(
          chalk.red(
            `The server, ${chalk.bold.italic(formattedURL)}, responded with status code ${
              res.statusCode
            } (${HTTP_CODES_AND_MESSAGES[res.statusCode] ?? "N/A"}).\n`
          )
        );
        resolve();
      }
    });

    req.on("error", reject);

    req.on("timeout", () => {
      Verbose.custom("The server timed out.");
      console.log(chalk.red(`The server, ${chalk.bold.italic(formattedURL)}, has timed out.\n`));
      resolve();
    });

    req.end();
  });
};

const ping = async (host, ...args) => {
  try {
    if (new Checks(host).paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a host", "ping www.google.com");
      return;
    }

    Verbose.custom("Initializing URL parser...");
    const split = host.split("/");
    const hostname = split.splice(0, 1);
    const path = split.length !== 0 ? "/" + split.join("/") : "";

    Verbose.custom("Making connection...");
    const result = await _makeConnection(hostname[0], path);
  } catch (err) {
    if (err.code === "ENOTFOUND") {
      Verbose.custom("An error occurred while trying to ping the address.");
      InfoMessages.error("The address could not be located.");
      return;
    } else if (err.code === "ECONNREFUSED") {
      Verbose.custom("The connection to the address was refused.");
      InfoMessages.error("The connection to the address was refused.");
      return;
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = ping;
