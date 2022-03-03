const express = require("express");

const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const { GetUserSearchList, GetUsers } = require("../controllers/User");

router.post("/users/search", GetUserSearchList);
router.get("/users/getList", authMiddleware, GetUsers);

module.exports = router;
