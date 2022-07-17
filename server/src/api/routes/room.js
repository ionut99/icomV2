"use strict";
const express = require("express");
const router = express.Router();
// 
const { GetRoomSearchList } = require("../controllers/User");
//
const {
  CreateNewRoom,
  DeleteRoom,
  CreateNewRoom_Group,
  AddNewMemberInGroup,
  GetPartList,
  GetMessageListInTime,
  GetRoomFolder,
  GetActiveRoomConnections,
} = require("../controllers/Room");

const { GetRoomNamesAdmin } = require("../controllers/Admin");

//
const { UpdateGroupPicture } = require("../controllers/Files");

router.post("/newroom", CreateNewRoom);
router.post("/deleteroom", DeleteRoom);
router.post("/search", GetRoomSearchList);
router.post("/active", GetActiveRoomConnections);
router.post("/messages", GetMessageListInTime);
router.post("/details", GetRoomFolder);
router.post("/newgroup", CreateNewRoom_Group);
router.post("/newmember", AddNewMemberInGroup);
router.post("/participants", GetPartList);
router.post("/groups", GetRoomNamesAdmin);
router.post("/updatePicture", UpdateGroupPicture);

module.exports = router;
