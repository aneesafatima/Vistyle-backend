const ErrorHandler = require("../utils/ErrorHandler");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
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


