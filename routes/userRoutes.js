const express = require("express");
const {updateUser} = require("../controllers/userController");
const router = express.Router();
router.patch("/:userId", updateUser);
module.exports = router;
