const express = require("express");
const router = express.Router();

const { SignInUser, LogOutUser, VerifyToken } = require("../controllers/Auth");
const {
  getNewUserChatList,
  GetUserDetails,
  EditUserAccountAsync,
} = require("../controllers/User");

//
const {
  InserNewUserAccount,
  adminGetUserList,
} = require("../controllers/Admin");
//

const { GetNOTPartList } = require("../controllers/Room");
const { UpdateProfilePicture } = require("../controllers/Files");
const { authMiddleware } = require("../middlewares/Auth");

router.post("/signin", SignInUser);
router.post("/logout", LogOutUser);
router.post("/verifyToken", VerifyToken);

router.post("/newchat", authMiddleware, getNewUserChatList);
router.post("/search", authMiddleware, adminGetUserList);
router.post("/toadd", authMiddleware, GetNOTPartList);
router.post("/updatePicture", authMiddleware, UpdateProfilePicture);
router.post("/details", authMiddleware, GetUserDetails);
router.post("/newuser", authMiddleware, InserNewUserAccount);
router.post("/edit", authMiddleware, EditUserAccountAsync);
module.exports = router;
