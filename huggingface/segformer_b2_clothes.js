//MODEL USAGE
const catchAsync = require("../utils/catchAsync");

// This code is for using the Segformer B2 model for semantic segmentation on clothing images.
exports.processImageWithHuggingFace = async (imgURL) => {
  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mattmdjaga/segformer_b2_clothes",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          "Content-Type": "image/jpeg",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: imgURL,
        }),
      }
    );
    const result = await response.json();
    const clothingTypes = [
      "T-shirt",
      "Shirt",
      "Pants",
      "Shorts",
      "Skirt",
      "Dress",
      "Jacket",
      "Coat",
      "Sweater",
      "Hoodie",
      "Shoes",
      "Sneakers",
      "Sandals",
      "Boots",
    ];

    const maskedItems = result
      .filter((item) => {
        return clothingTypes.includes(item.label);
      })
      .map((item) => {
        return item.mask;
      });
    return maskedItems;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error(error.message); // check for error middleware in express
  }
};
