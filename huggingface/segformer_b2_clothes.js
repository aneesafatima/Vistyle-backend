//MODEL USAGE
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");

// This code is for using the Segformer B2 model for semantic segmentation on clothing images.
exports.processImageWithHuggingFace = async (imgURL) => {
  try {
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/mattmdjaga/segformer_b2_clothes",
      { inputs: imgURL },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    const result = response.data;
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
        return {mask:item.mask,
          label: item.label,
        };
      });
    return maskedItems;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
};
