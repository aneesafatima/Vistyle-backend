const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const { spawn } = require("child_process");
// const { rembg } = require("@remove-background-ai/rembg.js");
const { uploadImage } = require("../helpers/imageProcessing");
const { resizeImage } = require("../helpers/imageProcessing");
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
 const filePath =  await resizeImage(url, 800);
 const outputPath = path.join(__dirname, "../tmp", "Output-2.png");
  // if (!resizedImg) {
  //   return next(new ErrorHandler("Error resizing image", 500));
  // }
  // const base64 = resizedImg.toString("base64");
  console.log("Starting python script... after resize");
  const python = spawn("rembg", ["i", filePath, outputPath]);
  // let result = "";
  console.log("Python script started...");
  let errorOutput = "";
  // python.stdin.write(base64);
  // python.stdin.end();
  // python.stdout.on("data", (data) => {
  //   result += data.toString();
  // });
  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });
  // python.stdout.on("data", (data) => {
  //   console.log("Python script output:", data.toString());
  // });
  python.on("close", async (code) => {
    console.log("Python script finished with code:", code);
    if (code !== 0 || errorOutput) {
      console.log("Python script error:", errorOutput);
      return next(new ErrorHandler("Error removing background", 500));
    }
    // const imgUrl = await uploadImage(result);
    // if (!imgUrl) {
    //   return next(new ErrorHandler("Error uploading image", 500));
    // }
    res.status(200).json({
      status: "success",
      // data: {
      //   imgUrl,
      // },
    });
  });
  // try {
  //   const { stderr, stdout } = await exec(`python removeBg.py ${base64}`);
  //   console.log("Python script output:", stdout);
  //   res.status(201).json({
  //     status: "success",
  //     // imgUrl,
  //   });
  // } catch (error) {
  //   console.error("Error executing Python script:", error);
  //   return next(new ErrorHandler("Error removing background", 500));
  // }

  // const result = await rembg({
  //   apiKey: process.env.REM_BG_API_KEY,
  //   inputImage: resizedImg,
  //   returnBase64: true,
  // });
  // if (!result) return next(new ErrorHandler("Error removing background", 500));
});
