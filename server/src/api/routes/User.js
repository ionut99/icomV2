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
} = require("../controllers/User");

router.post("/users/search", authMiddleware, GetUserSearchList);
router.post("/room/search", authMiddleware, GetRoomSearchList);
router.post("/room/messages", authMiddleware, GetRoomMessages);
router.post("/room/newmessage", authMiddleware, InsertNewMessage)
router.post("/room/newroom", authMiddleware, CreateNewRoom)

router.post("/room/deleteroom", authMiddleware, DeleteRoom)


router.get("/users/getList", authMiddleware, GetUsers);

module.exports = router;
