const express = require("express");

const router = express.Router();
const { SignInUser, LogOutUser, VerifyToken}  = require("../controllers/Auth");

router.post("/users/signin", SignInUser);
router.post("/users/logout", LogOutUser);
router.post("/verifyToken", VerifyToken);
module.exports = router;
