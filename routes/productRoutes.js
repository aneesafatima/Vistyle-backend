const express = require("express");
const { getAllProducts, addItemToCart, deleteFromCart } = require("../controllers/productController");
const router = express.Router();
router.get("/", getAllProducts);
router.post("/add-to-cart", addItemToCart);
router.delete("/delete-from-cart", deleteFromCart);
module.exports = router;
