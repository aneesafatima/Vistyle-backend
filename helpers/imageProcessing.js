const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const sharp = require("sharp");
exports.resizeImage = async function (image, width) {
  try {
    console.log("Resizing image to width:", width);
    const response = await axios.get(image, { responseType: "arraybuffer" });
    const resizedImage = await sharp(response.data).resize(width).toBuffer();
    console.log("Image resized successfully:");
    return resizedImage;
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
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, {
      public_id: "test-img2",
      folder: "vistyl",
    });
    console.log("Image uploaded successfully to Cloudinary.");
    return result.secure_url;
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    throw new Error(`Error uploading image`);
  }
};
