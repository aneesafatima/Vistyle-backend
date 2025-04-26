const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const { removeBackground } = require("@imgly/background-removal-node");
const { uploadImage } = require("../helpers/imageProcessing");


const {
  processImageWithHuggingFace,
} = require("../huggingface/segformer_b2_clothes");
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
  const result = await removeBackground(url);
  if (!result) {
    return next(new ErrorHandler("Error removing background", 500));
  }
  const base64 = Buffer.from(await result.arrayBuffer()).toString("base64");
  const imgUrl = await uploadImage(`data:image/png;base64,${base64}`);
  res.status(201).json({
    status: "success",
    imgUrl,
  });
});
