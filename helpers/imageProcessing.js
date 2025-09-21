const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const sharp = require("sharp");
const { rembg } = require("@remove-background-ai/rembg.js");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (base64, userId) => {
  try {
    console.log("Uploading image to Cloudinary...");
    const uniqueId = `${userId}_${Date.now()}`; // or use a UUID if available
    const result = await cloudinary.uploader.upload(base64, {
      public_id: uniqueId,
      folder: "vistyl",
    });
    console.log("Image uploaded successfully to Cloudinary.");
    return result.secure_url;
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    throw new Error(`Error uploading image`);
  }
};
exports.imageModification = async function (image, width, userId) {
  try {
    const response = await axios.get(image.trim(), {
      responseType: "arraybuffer",
    });
    const bufferData = await sharp(response.data)
      .resize(width)
      .png()
      .toBuffer();

    const output = await rembg({
      apiKey: process.env.REM_BG_API_KEY,
      inputImage: { base64: bufferData.toString("base64") },
      options: { returnBase64: true },
    });

    const uploadedUrl = await uploadImage(output.base64Image, userId);
    return uploadedUrl; // now returns actual URL
  } catch (err) {
    console.error("Error processing image:", err);
    throw err;
  }
};

// const res = await axios({
//   method: "post",
//   url: process.env.REM_BG_API,
//   headers: {
//     "X-API-Key": process.env.REM_BG_API_KEY,
//     "Content-Type": "application/json",
//   },
//   data: {
//     image_base64: bufferData.toString("base64"),
//   },
// });
