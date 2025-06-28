const express = require("express");
const designStudioController = require("../controllers/designStudioController");

const router = express.Router();
router.get("/create-item-mask", designStudioController.createItemMask);
router.get("/remove-bg", designStudioController.removeBg);
router.post("/create-sticker", designStudioController.createSticker);
router.delete("/delete-sticker", designStudioController.deleteStickerbyId);
router.delete("/delete-category", designStudioController.deleteCategory);
module.exports = router;
