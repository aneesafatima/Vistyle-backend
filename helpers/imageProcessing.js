const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const sharp = require("sharp");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (base64, userId) => {
  try {
    console.log("Uploading image to Cloudinary...");
    const uniqueId = `${userId}_${Date.now()}`; // or use a UUID if available
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

exports.imageModification = async function (image, width, userId) {
  try {
    console.log("Resizing image to width:", width);
    const response = await axios.get(image.trim(), {
      responseType: "arraybuffer",
    });
    const bufferData = await sharp(response.data)
      .resize(width)
      .png()
      .toBuffer();
    const res = await axios({
      method: "post",
      url: process.env.REM_BG_API,
      headers: {
        "X-API-Key": process.env.REM_BG_API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        image_base64: bufferData.toString("base64"),
      },
    });

    return await uploadImage(res.data.img_without_background_base64,userId);
  } catch (err) {
    console.error("Error processing image:", err);
    throw err;
  }
};
