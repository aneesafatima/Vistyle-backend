const catchAsync = require("../utils/catchAsync");
const { processImageWithHuggingFace } = require("../huggingface/segformer_b2_clothes");
exports.createItemSticker = catchAsync(async (req, res, next) => {
  const imgURL = req.body.imgURL;
  const itemName = req.body.itemName;
//   const itemType = req.body.itemType; \\fix later
  const itemPrice = req.body.itemPrice;
  const itemStore = req.body.itemStore;
//   const imgURL =
//     "https://image.hm.com/assets/hm/4c/a8/4ca84578db9251a3beb888a68ac5b35d6cd57aa9.jpg";
//   const itemName = "Loose Fit Printed T-shirt";
//   // const itemType = req.body.itemType;
//   const itemPrice = "Rs.699.00";
//   const itemStore = "H&M";
  processImageWithHuggingFace(imgURL).then((result) => {
    res.status(200).json({
      status: "success",
      data: {
        imgURL,
        itemName,
        itemPrice,
        itemStore,
        result,
      },
    });
  });
});
