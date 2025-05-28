const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
exports.resizeImage = async function (image, width) {
  try {
    const tempDir = path.join(__dirname, "../tmp");
    const tempFilePath = path.join(tempDir, `Output.png`);
    console.log("Resizing image to width:", width);
    const response = await axios.get(image, { responseType: "arraybuffer" });
    await sharp(response.data).resize(width).toFile(tempFilePath);
    console.log("Image resized successfully:");
    console.error("Resized image path:", tempFilePath);
    return tempFilePath;
  } catch (err) {
    console.error("Error resizing image:", err);
    throw err;
  }
};
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.uploadImage = async (base64) => {
  try {
    console.log("Uploading image to Cloudinary...");
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64}`,
      {
        public_id: "test-img2",
        folder: "vistyl",
      }
    );
    console.log("Image uploaded successfully to Cloudinary.");
    return result.secure_url;
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    throw new Error(`Error uploading image`);
  }
};
