"use strict";
const express = require("express");
const router = express.Router();
//
const {
  GetProfilePicture,
  UploadNewStoredFile,
  GetDocumentContent,
  DownLoadFile,
  GetPicturePreview,
  SaveCustomTextFile,
} = require("../controllers/Files");

router.post("/profile", GetProfilePicture);
router.post("/newfile", UploadNewStoredFile);
router.post("/content", GetDocumentContent);
router.post("/download", DownLoadFile);
router.post("/imgpreview", GetPicturePreview);
router.post("/savetext", SaveCustomTextFile);

module.exports = router;
