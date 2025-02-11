const chalk = require("chalk");
const https = require("https");

const HTTP_CODES_AND_MESSAGES = require("../data/httpCodes.json");

const _fatalError = require("../functions/fatalError");
const { GLOBAL_NAME } = require("../variables/constants");

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
    const url = new URL(
      (!host.startsWith("http://") && !host.startsWith("https://") ? "https://" : "") + host
    );
    const hostname = url.hostname;
    const path = url.pathname;

    Verbose.custom("Making connection...");
    await _makeConnection(hostname, path);
  } catch (err) {
    if (err.code === "ENOTFOUND") {
      Verbose.custom("An error occurred while trying to ping the address.");
      InfoMessages.error("The address could not be located.");
    } else if (err.code === "ECONNREFUSED") {
      Verbose.custom("The connection to the address was refused.");
      InfoMessages.error("The connection to the address was refused.");
    } else if (err.code === "EHOSTUNREACH" || err.code === "ENETUNREACH") {
      Verbose.custom("The address is unreachable.");
      InfoMessages.error("The address is unreachable.");
    } else if (err.code === "EADDRINUSE") {
      Verbose.custom("The address is in use.");
      InfoMessages.error("The address is in use.");
    } else if (err.code === "EADDRNOTAVAIL") {
      Verbose.custom("The address is not available.");
      InfoMessages.error("The address is not available.");
    } else if (err.code === "ECONNRESET") {
      Verbose.custom("The connection was forcibly closed by the remote host.");
      InfoMessages.error("The connection was forcibly closed by the remote host.");
    } else if (err.code === "EPIPE") {
      Verbose.custom("The connection was closed unexpectedly.");
      InfoMessages.error("The connection was closed unexpectedly.");
    } else if (err.code === "SELF_SIGNED_CERT_IN_CHAIN") {
      Verbose.custom("Self-signed certificate in chain.");
      InfoMessages.error(
        `Self-signed certificate in chain. ${GLOBAL_NAME} does not support pinging servers with self-signed certificates to prevent security issues such as the man-in-the-middle attack.`
      );
    } else {
      Verbose.fatalError();
      _fatalError(err);
    }
  }
};

module.exports = ping;
