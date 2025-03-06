const chalk = require("chalk");
const https = require("https");

const HTTP_CODES_AND_MESSAGES = require("../data/httpCodes.json");

const { GLOBAL_NAME } = require("../variables/constants");

const _nonFatalError = require("../functions/nonFatalError");

const Errors = require("../classes/Errors");
const Checks = require("../classes/Checks");
const InfoMessages = require("../classes/InfoMessages");
const Verbose = require("../classes/Verbose");

/**
 * Make a connection with a specified address.
 *
 * @param {string} host The host to connect to.
 * @param {string} path The path of the host. Defaults to empty.
 * @param {number} maxRedirects Max redirects before the command fails. Defaults to 5.
 * @returns A Promise of the request.
 */
const _makeConnection = async (host, path = "", maxRedirects = 5) => {
  const options = {
    host,
    path,
    timeout: 5000,
    method: "HEAD", // HEAD request to only fetch headers
    rejectUnauthorized: true,
  };

  Verbose.custom("Creating formatted URL...");
  let formattedURL = (options.host + options.path).replace(/^www\.|\/+$/g, "");

  if (formattedURL.endsWith(".")) {
    Verbose.custom("Removing trailing period from URL...");
    formattedURL = formattedURL.slice(0, -1);
    options.host = formattedURL;
  }

  // The reason resolve() is used everywhere is because if
  // reject() is used, BubbleOS will crash
  return new Promise((resolve, reject) => {
    Verbose.custom("Creating new request...");
    const req = https.request(options, (res) => {
      // Prevents the timed out error from appearing once the request is completed
      Verbose.custom("Destroying any previous requests...");
      req.setTimeout(0);
      req.destroy();

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
            `The server, ${chalk.bold.italic(formattedURL)}, is responding with status code 200 (${
              HTTP_CODES_AND_MESSAGES[res.statusCode] ?? "N/A"
            })!\n`
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
      InfoMessages.error(`The server, ${chalk.bold.italic(formattedURL)}, has timed out.`);
      resolve();
    });

    req.end();
  });
};

/**
 * Pings a specified address and returns the status
 * code and message that was given by the server.
 *
 * @param {...string} host The host address to ping.
 */
const ping = async (...host) => {
  try {
    host = host.join(" ");

    if (new Checks(host).paramUndefined()) {
      Verbose.chkEmpty();
      Errors.enterParameter("a host", "ping google.com");
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
    } else if (err.code === "EAI_AGAIN") {
      Verbose.custom("DNS lookup timed-out error.");
      InfoMessages.error("DNS lookup timed-out error.");
    } else if (err.code === "ETIMEDOUT") {
      Verbose.custom("The connection attempt timed out.");
      InfoMessages.error("The connection attempt timed out.");
    } else if (err.code === "ECONNABORTED") {
      Verbose.custom("The connection was aborted.");
      InfoMessages.error("The connection was aborted.");
    } else if (err.code === "EHOSTDOWN") {
      Verbose.custom("The host is down or not responding.");
      InfoMessages.error("The host is down or not responding.");
    } else if (err.code === "EPROTO") {
      Verbose.custom("A protocol error occurred.");
      InfoMessages.error("A protocol error occurred.");
    } else if (err.code === "EBADF") {
      Verbose.custom("A bad file descriptor error occurred.");
      InfoMessages.error("A bad file descriptor error occurred.");
    } else if (err.code === "EMFILE") {
      Verbose.custom("Too many open files in the system.");
      InfoMessages.error("Too many open files in the system.");
    } else if (err.code === "ENETDOWN") {
      Verbose.custom("The network is down.");
      InfoMessages.error("The network is down.");
    } else if (err.code === "EISCONN") {
      Verbose.custom("The socket is already connected.");
      InfoMessages.error("The socket is already connected.");
    } else if (err.code === "ESHUTDOWN") {
      Verbose.custom("The socket has been shut down.");
      InfoMessages.error("The socket has been shut down.");
    } else if (err.code === "ENOBUFS") {
      Verbose.custom("No buffer space available.");
      InfoMessages.error("No buffer space available.");
    } else if (err.code === "EINVAL") {
      Verbose.custom("Invalid argument passed to a function.");
      InfoMessages.error("Invalid argument passed to a function.");
    } else if (err.code === "SELF_SIGNED_CERT_IN_CHAIN") {
      Verbose.custom("Self-signed certificate in chain.");
      InfoMessages.error(
        `Self-signed certificate in chain. ${GLOBAL_NAME} does not support pinging servers with self-signed certificates for security reasons, such as the man-in-the-middle attack.`
      );
    } else if (err.code === "DEPTH_ZERO_SELF_SIGNED_CERT") {
      Verbose.custom("Self-signed certificate.");
      InfoMessages.error(
        `Self-signed certificate. ${GLOBAL_NAME} does not support pinging servers with self-signed certificates for security reasons, such as the man-in-the-middle attack.`
      );
    } else if (err.code === "ERR_INVALID_URL") {
      Verbose.custom("Invalid URL.");
      InfoMessages.error("Invalid URL.");
    } else {
      Verbose.nonFatalError();
      _nonFatalError(err);
    }
  }
};

module.exports = ping;
