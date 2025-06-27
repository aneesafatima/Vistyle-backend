const express = require("express");
const { getAllProducts, addItemToCart } = require("../controllers/productController");
const router = express.Router();
router.get("/", getAllProducts);
router.post("/add-to-cart", addItemToCart);


module.exports = router;
