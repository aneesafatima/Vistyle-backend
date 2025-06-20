const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const { imageModification } = require("../helpers/imageProcessing");
const {
  processImageWithHuggingFace,
} = require("../huggingface/segformer_b2_clothes");
const User = require("../models/userModel");

exports.createItemMask = catchAsync(async (req, res, next) => {
  const imgURL = req.query.imgURL;
  try {
    const result = await processImageWithHuggingFace(imgURL);
    res.status(200).json({
      status: "success",
      data: {
        imgURL,
        result,
      },
    });
  } catch (error) {
    next(new ErrorHandler(error, 500));
  }
});

exports.removeBg = catchAsync(async (req, res, next) => {
  const url = req.query.imgURL;
  if (!url) {
    return next(new ErrorHandler("Image URL not found", 404));
  }
  const uploadedUrl = await imageModification(url, 200);
  res.status(200).json({
    status: "success",
    data: {
      imgURL: uploadedUrl,
    },
  });
});

exports.createSticker = catchAsync(async (req, res, next) => {
  const { url, price, category, position, email,code } = req.body;
  console.log(req.body);
  if (!url || !price || !category || !position || !email || !code)
    return next(new ErrorHandler("Invalid Data", 400));
  if (!email) return next(new ErrorHandler("Email is required", 400));
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorHandler("User not found. Please register first.", 404)
    );
  }
  try {
    if (user.stickers?.length >= 10) {
      return next(
        new ErrorHandler(
          "You have exceeded the limit of 10 stickers as a test user. Thank you for using the MVP. Please give necessary feedback in the feedback forum on the home screen.",
          400
        )
      );
    }
    const uploadedUrl = await imageModification(url, 200, user._id.toString());
    if (!user.stickers) {
      user.stickers = [];
    } //remove this line later for newly created users
    user.stickers.push({
      url: uploadedUrl,
      price,
      category,
      position,
      code
    });
    await user.save();
    res.status(200).json({
      status: "success",
      stickers: user.stickers,
    });
  } catch (error) {
    next(new ErrorHandler(error, 500));
  }
});
