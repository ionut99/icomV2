"use strict";
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const { GetDocument, GetProfilePicture, UploadNewStoredFile } = require("../controllers/Files");

// router.post("/getdocument", authMiddleware, GetDocument);
// router.post("/geprofilepicture", authMiddleware, GetProfilePicture);

router.post("/getdocument", GetDocument);
router.post("/getprofilepicture", GetProfilePicture);
router.post("/newStoragefile", UploadNewStoredFile)

module.exports = router;
