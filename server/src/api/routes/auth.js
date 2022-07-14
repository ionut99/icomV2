const { handleResponse } = require("../helpers/auth_utils");
"use strict";
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();


router.get("/authenticate", (req, res) => {
  const cert = req.socket.getPeerCertificate();

  if (req.client.authorized) {
    res.send(
      `Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`
    );
  } else if (cert.subject) {
    res
      .status(403)
      .send(
        `Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`
      );
  } else {
    res
      .status(401)
      .send(`Sorry, but you need to provide a client certificate to continue.`);
  }
});


router.get("/test", (req, res) => {
  return handleResponse(req, res, 200,  "The server is up!" );
});

module.exports = router;
