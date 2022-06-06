"use strict";
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const {
  GetProfilePicture,
  UploadNewStoredFile,
  GetDocumentContent,
  DownLoadFile,
  GetPicturePreview,
} = require("../controllers/Files");

// router.post("/getdocument", authMiddleware, GetDocument);
// router.post("/geprofilepicture", authMiddleware, GetProfilePicture);

router.post("/profile", GetProfilePicture);
router.post("/newfile", UploadNewStoredFile);
router.post("/content", GetDocumentContent);
router.post("/download", DownLoadFile);
router.post("/imgpreview", GetPicturePreview);

module.exports = router;
