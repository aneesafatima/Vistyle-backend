const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const sharp = require("sharp");
exports.resizeImage = async function (image, width) {
  console.log("Image url:", image);
  console.log("Image type:", typeof image);
  try {
    console.log("Resizing image to width:", width);
    const response = await axios.get(image, { responseType: "arraybuffer" });
    // const imageBuffer = Buffer.from(response.data);
    return await sharp(response.data).resize(width).toBuffer();
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
    // const resizedImage = await resizeImage(base64, 600);
    console.log("Resized image:", base64.slice(0, 20));
    console.log("Uploading image to Cloudinary...");
    const result = await cloudinary.uploader.upload(base64, {
      public_id: "test-img2",
      folder: "vistyl",
      // transformation: [
      //   {
      //     width: 600,
      //     crop: "limit",
      //     quality: "auto:best",
      //     dpr: "auto",
      //   },
      // ],
    });
    console.log("Image uploaded successfully to Cloudinary.");
    return result.secure_url;
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    throw new Error(`Error uploading image`);
  }
};
