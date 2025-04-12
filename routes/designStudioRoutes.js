const express = require("express");
const designStudioController = require("../controllers/designStudioController");

const router = express.Router();
router.post(
  "/create-item-sticker",
  designStudioController.createItemSticker
);
module.exports = router;
