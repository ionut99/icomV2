"use strict";
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const {
  GetProfilePicture,
  UploadNewStoredFile,
  GetDocumentContent,
} = require("../controllers/Files/Files");

// router.post("/getdocument", authMiddleware, GetDocument);
// router.post("/geprofilepicture", authMiddleware, GetProfilePicture);

router.post("/getprofilepicture", GetProfilePicture);
router.post("/newStoragefile", UploadNewStoredFile);
router.post("/getdocumentcontent", GetDocumentContent);

module.exports = router;
