"use strict";
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/Auth");
const { GetDocument } = require("../controllers/File");

router.post("/getdocument", authMiddleware, GetDocument);

module.exports = router;
