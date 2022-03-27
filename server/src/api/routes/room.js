"use strict";
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const {
  GetRoomSearchList,
  GetRoomMessages,
  InsertNewMessage,
  CreateNewRoom,
  DeleteRoom,
  CreateNewRoom_Group,
  AddNewMemberInGroup,
  GetPartList,
} = require("../controllers/User");

router.post("/newroom", authMiddleware, CreateNewRoom);
router.post("/deleteroom", authMiddleware, DeleteRoom);

router.post("/search", authMiddleware, GetRoomSearchList);
router.post("/messages", authMiddleware, GetRoomMessages);

router.post("/newmessage", authMiddleware, InsertNewMessage);
router.post("/newgroup", authMiddleware, CreateNewRoom_Group);
router.post("/newmember", authMiddleware, AddNewMemberInGroup);
router.post("/participants", authMiddleware, GetPartList);

module.exports = router;
