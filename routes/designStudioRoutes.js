const express = require("express");
const designStudioController = require("../controllers/designStudioController");

const router = express.Router();
router.get(
  "/create-item-mask",
  designStudioController.createItemMask
);
module.exports = router;
