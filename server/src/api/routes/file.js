"use strict";
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const { GetDocument, GetProfilePicture } = require("../controllers/Files");

// router.post("/getdocument", authMiddleware, GetDocument);
router.post("/getdocument", GetDocument);
router.post("/geprofilepicture", GetProfilePicture);

module.exports = router;
