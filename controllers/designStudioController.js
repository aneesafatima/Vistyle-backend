const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const { removeBackground } = require("@imgly/background-removal-node");
const { exec } = require("node:child_process");
const { uploadImage } = require("../helpers/imageProcessing");
const { pathToFileURL } = require("url");
const { resizeImage } = require("../helpers/imageProcessing");
const fs = require("fs");
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
  const filePath = await resizeImage(url, 800);
  const outputPath = path.join(__dirname, "../tmp", `output_${Date.now()}.png`);
  console.log("Resized image path:", filePath);
  if (!filePath) {
    return next(new ErrorHandler("Error resizing image", 500));
  }
  const fileUrl = pathToFileURL(filePath).href;
  try {
    removeBackground(fileUrl).then(async (blob) => {
      const buffer = Buffer.from(await blob.arrayBuffer());
      fs.writeFileSync(outputPath, buffer);
    });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error("Error removing background:", error);
    return next(new ErrorHandler("Error removing background", 500));
  }


  // exec(
  //   `python3 removeBg.py ${filePath} ${outputPath}`,
  //   (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`Error executing Python script: ${error.message}`);
  //       if (stderr) {
  //         console.error(`Python script stderr: ${stderr}`);
  //       }
  //       return next(new ErrorHandler("Error removing background", 500));
  //     }
  //     if (stdout) {
  //       console.log(`Python script output: ${stdout}`);
  //     }
  //     console.log("Python script finished successfully.");
  //     res.status(200).json({
  //       status: "success",
  //     });
  //   }
  // );
});

// exports.removeBg = catchAsync(async (req, res, next) => {
//   const url = req.query.imgURL;
//   if (!url) {
//     return next(new ErrorHandler("Image URL not found", 404));
//   }
//   const filePath = await resizeImage(url, 800);
//   const outputPath = path.join(__dirname, "../tmp", `output_${Date.now()}.png`);
//   // if (!resizedImg) {
//   //   return next(new ErrorHandler("Error resizing image", 500));
//   // }
//   // const base64 = resizedImg.toString("base64");
//   console.log("Starting python script... after resize");
//   const python = spawn("python", ["./removeBg.py", filePath, outputPath]);

//   // let result = "";
//   console.log("Python script started...");
//   let errorOutput = "";
//    python.stdout.on("data", (data) => {
//     console.log("Python script output:", data.toString());
//    })
//   python.stderr.on("data", (data) => {
//     errorOutput += data.toString();
//   });
//   python.on("close", async (code) => {
//     console.log("Python script finished with code:", code);
//     if (code !== 0 || errorOutput) {
//       console.log("Python script error:", errorOutput);
//       return next(new ErrorHandler("Error removing background", 500));
//     }
//     // const imgUrl = await uploadImage(result);
//     // if (!imgUrl) {
//     //   return next(new ErrorHandler("Error uploading image", 500));
//     // }
//     res.status(200).json({
//       status: "success",
//       // data: {
//       //   imgUrl,
//       // },
//     });
//   });
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
// });
