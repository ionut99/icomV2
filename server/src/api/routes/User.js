const express = require("express");

const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const {
  GetUserSearchList,
  GetUsers,
  UpdateProfilePicture,
} = require("../controllers/User");
const { SignInUser, LogOutUser, VerifyToken } = require("../controllers/Auth");

router.post("/signin", SignInUser);
router.post("/logout", LogOutUser);
router.post("/verifyToken", VerifyToken);

router.post("/search", authMiddleware, GetUserSearchList);
router.get("/getList", authMiddleware, GetUsers);
router.post("/updatePicture", authMiddleware, UpdateProfilePicture);

module.exports = router;
