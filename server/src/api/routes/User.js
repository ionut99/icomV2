const express = require("express");

const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const {
  GetUserSearchList,
  GetUsers,
  GetRoomSearchList,
  GetRoomMessages,
  InsertNewMessage,
  CreateNewRoom,
  DeleteRoom,
  CreateNewRoom_Group,
  AddNewMemberInGroup,
  GetPartList,
} = require("../controllers/User");

router.post("/users/search", authMiddleware, GetUserSearchList);
router.post("/room/search", authMiddleware, GetRoomSearchList);
router.post("/room/messages", authMiddleware, GetRoomMessages);
router.post("/room/newmessage", authMiddleware, InsertNewMessage);
router.post("/room/newroom", authMiddleware, CreateNewRoom);

router.post("/room/deleteroom", authMiddleware, DeleteRoom);
router.post("/room/newgroup", authMiddleware, CreateNewRoom_Group);
router.post("/room/newmember", authMiddleware, AddNewMemberInGroup);
router.post("/room/participants", authMiddleware, GetPartList);
router.get("/users/getList", authMiddleware, GetUsers);

module.exports = router;
