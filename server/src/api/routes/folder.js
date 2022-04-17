"use strict";
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const {
  AddNewFolder,
  GetFolderDataBase,
  GetChildFolderList,
} = require("../controllers/Folders");

// router.post("/newfolder", authMiddleware, AddNewFolder);
// router.post("/getfolder", authMiddleware, GetFolderDataBase);
router.post("/newfolder", AddNewFolder);
router.post("/getfolder", GetFolderDataBase);
router.post("/getchilds", GetChildFolderList);

module.exports = router;
