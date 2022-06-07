import pavel_cert from "../cert/pavel_cert.pem";
import pavel_key from "../cert/pavel_key.pem";
import server_cert from "../cert/server_cert.pem";
const https = require("https");
// const path = require("path");

// For more `https.Agent` options, see here:
// https://nodejs.org/api/https.html#https_https_request_options_callback

export const httpsAgent = new https.Agent({
  // cert: fs.readFileSync(certFile),
  // key: fs.readFileSync(keyFile),
  cert: pavel_cert,
  key: pavel_key,
  ca: server_cert,
  passphrase: "YYY",
  rejectUnauthorized: false,
});
