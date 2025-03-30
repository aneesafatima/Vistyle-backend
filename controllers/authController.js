const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/Email");
const speakeasy = require("speakeasy");

const sendToken = (user, statusCode, res) => {
  const token = createSendToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    user: user,
  });
};

const createSendToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//TO SIGN UP A USER
exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const obj = new Email(user);
  obj.sendWelcome(user);
  //SEND RELEVANT USER DATA
  sendToken(user, 201, res);
});

//TO LOGIN A USER
exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Please enter email or password", 401));
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePasswords(password, user.password)))
    return next(new ErrorHandler("Invalid email or password", 401));
  if (!user || !(await user.comparePasswords(password, user.password)))
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  sendToken(user, 200, res);
});

//TO PROTECT ROUTES
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("B"))
    token = authorization.split(" ")[1];
  if (!token)
    return next(
      new ErrorHandler(
        "You are not logged in ! Please log in to access the page.",
        400
      )
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findOne({ _id: decoded.id });

  if (!currentUser)
    return next(new ErrorHandler("There is no user belonging to this Id", 400));

  res.status(200).json({
    status: "success",
    user: currentUser
  });
});

exports.logOut = (req, res) => {
  //write logic for react native
  res.status(200).json({
    status: "success",
  });
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    return next(
      new ErrorHandler(
        "No email provided. Please Enter your account email.",
        400
      )
    );
  const user = await User.findOne({ email }).select("+otpsecret");
  if (!user)
    return next(new ErrorHandler("There is no User with this ID", 404));
  const otp = speakeasy.totp({
    secret: user.otpsecret,
    encoding: "base32",
    digits: 6,
    step: 300, // 5 minutes validity
  });
  await new Email(user).sendPasswordResetOTP(otp);
  res.status(200).json({
    status: "success",
    message: "OTP sent to your email",
  });
};

exports.checkOTP = async (req, res, next) => {
  const { otp, email } = req.body;
  const user = await User.findOne({ email }).select("+otpsecret");
  const result = speakeasy.totp.verify({
    secret: user.otpsecret,
    encoding: "base32",
    token: otp,
    digits: 6,
    step: 300,
  });
  if (result) {
    req.user = user;
    return res.status(200).json({
      status: "success",
      message: "OTP is correct",
    });
  }
  res.status(400).json({
    status: "failed",
    message: "OTP is incorrect",
  });
};

exports.resetPassword = async (req, res, next) => {
  console.log("In reset password")
  const { password, passwordConfirm, email } = req.body;
  if (!password || !passwordConfirm)
    return next(
      new ErrorHandler("Please enter password and confirm password", 400)
    );
  if (password !== passwordConfirm)
    return next(new ErrorHandler("Passwords do not match", 400));
  const user = await User.findOne({ email }).select("+password");
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  sendToken(user, 200, res);
};
