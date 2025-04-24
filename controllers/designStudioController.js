const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const { removeBackground } = require("@imgly/background-removal-node");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  const url = req.query.url;
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

const uploadImage = async (base64) => {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      public_id: "test-img",
      folder: "vistyl",
      transformation: [
        {
          width: 1000,
          crop: "limit",
          quality: "auto:best",
          dpr: "auto",
        },
      ],
    });
    return result.secure_url;
  } catch (err) {
    throw new Error("Error uploading image");
  }
};
