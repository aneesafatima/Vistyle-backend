const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const { imageModification } = require("../helpers/imageProcessing");
const {
  processImageWithHuggingFace,
} = require("../huggingface/segformer_b2_clothes");
const path = require("path");

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

// const result = await rembg({
//   apiKey: process.env.REM_BG_API_KEY,
//   inputImage: resizedImg,
//   returnBase64: true,
// });
// if (!result) return next(new ErrorHandler("Error removing background", 500));
// });
