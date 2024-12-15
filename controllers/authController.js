const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");

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
  sendToken(user, 201, res);
});

//TO LOGIN A USER
exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // if (!email || !password)
  //   return next(new ErrorHandler("Please enter email or password", 401));
  // const user = await User.findOne({ email }).select("+password");
  // if (!user || !(await user.comparePasswords(password, user.password)))
  //   return next(new ErrorHandler("Invalid email or password", 401));

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Please provide a password",
    });
  }

  const user = await User.findOne({ email }).select("+password");

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

  req.user = currentUser;

  next();
});

exports.logOut = (req, res) => {
  //write logic for react native
  res.status(200).json({
    status: "success",
  });
};
