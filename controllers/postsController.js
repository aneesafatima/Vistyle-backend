const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const Post = require("../models/postModel");
const User = require("../models/userModel");
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  if (posts.length == 0) return next(new ErrorHandler("No posts found", 404));
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: posts,
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorHandler("No post found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: post,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return next(new ErrorHandler("No post found with that ID", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  console.log("req.body", req.body);
  console.log("In updatePost controller");
  const allowedFields = [
    "cheers",
    "totalPrice",
    "interests",
    "fashionHouse",
    "prompt",
  ];
  for (let key in req.body) {
    if (!allowedFields.includes(key))
      return next(new ErrorHandler("Invalid updation field", 400));
  }
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) return next(new ErrorHandler("No post found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: post,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const postData = await Post.create(req.body);
  if (!postData) next(new ErrorHandler("Post not created", 400));
  res.status(201).json({
    status: "success",
    data: postData,
  });
});

exports.getPostByHouse = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ fashionHouse: req.params.fashionHouse });
  if (posts.length == 0) return next(new ErrorHandler("No posts found", 404));
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: posts,
  });
});
exports.getPostByInterests = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const userData = await User.findById(userId).select("interests");
  if (!userData)
    return next(new ErrorHandler("No user found with that ID", 404));
  const interests = userData.interests;
  const posts = await Post.find({ interests: { $in: interests } });
  if (posts.length == 0) return next(new ErrorHandler("No posts found", 404));
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: posts,
  });
});

exports.getPostsByFashionHouse = catchAsync(async (req, res, next) => {
  const houseName = req.params.houseName;
  const posts = await Post.find({ fashionHouse: houseName });
  if (posts.length == 0) return next(new ErrorHandler("No posts found", 404));
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: posts,
  });
});
