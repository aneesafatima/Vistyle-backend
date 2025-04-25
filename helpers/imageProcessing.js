const { Jimp } = require("jimp");
const cloudinary = require("cloudinary").v2;
async function resizeImage(image, width) {
  try {
    console.log("Resizing image to width:", width);
    console.log("Resizing image...");
    const img = await Jimp.fromBuffer(
      Buffer.from(image.split(",")[1], "base64")
    );
    img.resize({
      w: width,
      h: Jimp.AUTO, // Maintain aspect ratio
    }); // Resize to width, maintaining aspect ratio
    const resizedImage = await img.getBase64("image/png");
    console.log("Image resized successfully.");
    return resizedImage;
  } catch (err) {
    console.error("Error resizing image:", err);
    throw err;
  }
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.uploadImage = async (base64) => {
  try {
    const resizedImage = await resizeImage(base64, 600);
    console.log("Resized image:", resizedImage.slice(0, 20));
    console.log("Uploading image to Cloudinary...");
    const result = await cloudinary.uploader.upload(resizedImage, {
      public_id: "test-img2",
      folder: "vistyl",
      transformation: [
        {
          width: 600,
          crop: "limit",
          quality: "auto:best",
          dpr: "auto",
        },
      ],
    });
    console.log("Image uploaded successfully to Cloudinary.");
    return result.secure_url;
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    throw new Error(`Error uploading image`);
  }
};
