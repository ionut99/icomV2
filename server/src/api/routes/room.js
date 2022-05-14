"use strict";
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const { GetRoomSearchList, InsertNewMessage } = require("../controllers/User");

const {
  CreateNewRoom,
  DeleteRoom,
  CreateNewRoom_Group,
  AddNewMemberInGroup,
  GetPartList,
  GetRoomMessages,
} = require("../controllers/Room");

// router.post("/newroom", authMiddleware, CreateNewRoom);
// router.post("/deleteroom", authMiddleware, DeleteRoom);

// router.post("/search", authMiddleware, GetRoomSearchList);
// router.post("/messages", authMiddleware, GetRoomMessages);

// router.post("/newmessage", authMiddleware, InsertNewMessage);
// router.post("/newgroup", authMiddleware, CreateNewRoom_Group);
// router.post("/newmember", authMiddleware, AddNewMemberInGroup);
// router.post("/participants", authMiddleware, GetPartList);

router.post("/newroom", CreateNewRoom);
router.post("/deleteroom", DeleteRoom);

router.post("/search", GetRoomSearchList);
router.post("/messages", GetRoomMessages);

router.post("/newmessage", InsertNewMessage);
router.post("/newgroup", CreateNewRoom_Group);
router.post("/newmember", AddNewMemberInGroup);
router.post("/participants", GetPartList);

module.exports = router;
