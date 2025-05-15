const express = require("express");
const {updateUser, updatePassword} = require("../controllers/userController");
const router = express.Router();
router.patch("/:userId", updateUser);
router.patch("/update-password/:userId", updatePassword);
module.exports = router;
