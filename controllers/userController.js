const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
exports.updateUser = catchAsync(async (req, res, next) => {
  const allowedFields = [
    "name",
    "email",
    "password",
    "passwordConfirm",
    "interests",
  ];
  for (let key in req.body) {
    if (!allowedFields.includes(key))
      return next(new ErrorHandler("Invalid updation field", 400));
  }
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new ErrorHandler("No user found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: user,
  });
});
