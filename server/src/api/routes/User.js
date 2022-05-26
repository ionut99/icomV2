const express = require("express");
const router = express.Router();

const { SignInUser, LogOutUser, VerifyToken } = require("../controllers/Auth");
const {
  getNewUserChatList,
  GetUserDetails,
  InserNewUserAccount,
  EditUserAccountAsync,
  adminGetUserList,
} = require("../controllers/User");
const { GetNOTPartList } = require("../controllers/Room");
const { UpdateProfilePicture } = require("../controllers/Files");
const { authMiddleware } = require("../middlewares/Auth");

router.post("/signin", SignInUser);
router.post("/logout", LogOutUser);
router.post("/verifyToken", VerifyToken);

// router.post("/search", authMiddleware, GetUserSearchList);
// router.post("/updatePicture", authMiddleware, UpdateProfilePicture);
router.post("/newchat", getNewUserChatList);
router.post("/search", adminGetUserList);
router.post("/toadd", GetNOTPartList);
router.post("/updatePicture", UpdateProfilePicture);
router.post("/details", GetUserDetails);
router.post("/newuser", InserNewUserAccount);
router.post("/edit", EditUserAccountAsync);
module.exports = router;
