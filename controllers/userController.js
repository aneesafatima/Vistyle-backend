const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
exports.updateUser = catchAsync(async (req, res, next) => {
  const allowedFields = [
    "name",
    "description",
    "password",
    "passwordConfirm",
    "interests",
    "designHouse",
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

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, newpassword } = req.body;
  if (!password || !newpassword)
    return next(new ErrorHandler("Please provide a password", 400));
  const user = await User.findById(req.params.userId).select("+password");
  if (!user) return next(new ErrorHandler("No user found with that ID", 404));
  if (!(await user.comparePasswords(password)))
    return next(new ErrorHandler("Incorrect Password", 404));
  user.password = newpassword;
  user.passwordConfirm = newpassword;
  await user.save();
  res.status(200).json({
    status: "success",
    data: user,
  });
});
