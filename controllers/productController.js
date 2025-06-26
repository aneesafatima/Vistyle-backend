const ErrorHandler = require("../utils/ErrorHandler");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const { store } = req.query;

  if (!store) {
    return next(new ErrorHandler("Store not found", 404));
  }
  if (store == "hm") {
    const response = await axios.get(process.env.HM_API_URL, {
      params: {
        country: "in", //change it later to an optional country
        lang: "en",
        currentpage: "0",
        pagesize: "5",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST,
      },
    });
    const products = response.data;
    res.status(200).json({
      status: "success",
      results: products.results,
    });
  }
});

exports.addItemToCart = catchAsync(async (req, res, next) => {
  const { code, size, price, title, url, email } = req.query;
  if (!code || !size || !price || !title || !url || !email) {
    return next(new ErrorHandler("Missing required query parameters", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const existingItem = user.cart.find((item) => item.code === code);
  if (!existingItem) {
    user.cart.push({
      code,
      size,
      price,
      title,
      url,
    });
    await user.save();
  }
  res.status(200).json({
    status: "success",
    message: `Product ${code} added to cart from store H&M`,
  });
});
