"use strict";
const express = require("express");
const router = express.Router();
// 
const {
  AddNewFolder,
  GetFolderDetails,
  GetChildFolderList,
  GetChildFilesList,
} = require("../controllers/Folders");

router.post("/newfolder", AddNewFolder);
router.post("/getfolder", GetFolderDetails);
router.post("/getchilds", GetChildFolderList);
router.post("/getfiles", GetChildFilesList);

module.exports = router;
