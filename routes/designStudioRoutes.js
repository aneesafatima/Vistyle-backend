const express = require("express");
const designStudioController = require("../controllers/designStudioController");

const router = express.Router();
router.get("/create-item-mask", designStudioController.createItemMask);
router.get("/remove-bg", designStudioController.removeBg);
router.post("/create-sticker", designStudioController.createSticker);
module.exports = router;
