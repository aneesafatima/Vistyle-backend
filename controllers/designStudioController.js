const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
// const { removeBackground } = require("@imgly/background-removal-node");
const { rembg } = require("@remove-background-ai/rembg.js");
const { uploadImage } = require("../helpers/imageProcessing");
const { resizeImage } = require("../helpers/imageProcessing");
const {
  processImageWithHuggingFace,
} = require("../huggingface/segformer_b2_clothes");
const { format } = require("path");

const config = {
  debug: true, // enable or disable useful console.log outputs
  device: "cpu", // choose the execution device. gpu will use webgpu if available
  proxyToWorker: true, // Whether to proxy the calculations to a web worker. (Default true)
  model: "medium", // The model to use. (Default "isnet_fp16")
  output: {
    format: "image/png", // The output format. (Default "image/png")
    quality: 1, // The quality. (Default: 0.8)
    type: "foreground", // The output type. 'foreground' | 'background' | 'mask' (Default "foreground")
  },
};

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
  const resizedImg = await resizeImage(url, 800);
  if (!resizedImg) {
    return next(new ErrorHandler("Error resizing image", 500));
  }
  // const blob = new Blob([resizedImg], { type: "image/png" });
  // const result = await removeBackground(blob, config);
  const result = await rembg({
    apiKey: process.env.REM_BG_API_KEY,
    inputImage: resizedImg,
    returnBase64: true,
  });
  if (!result) {
    return next(new ErrorHandler("Error removing background", 500));
  }
  // const base64 = Buffer.from(await result.arrayBuffer()).toString("base64");
  const imgUrl = await uploadImage(result.base64Image);
  // console.log(result.base64Image.slice(0, 25));
  res.status(201).json({
    status: "success",
    imgUrl,
  });
});
