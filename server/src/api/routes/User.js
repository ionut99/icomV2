const express = require("express");

const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const { GetUserSearchList, GetUsers, GetRoomSearchList } = require("../controllers/User");

router.post("/users/search", authMiddleware, GetUserSearchList);
router.post("/room/search", authMiddleware, GetRoomSearchList);

router.get("/users/getList", authMiddleware, GetUsers);

module.exports = router;
