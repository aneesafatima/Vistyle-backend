const express = require("express");
const {
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  createPost,
  getPostByInterests,
  getPostsByFashionHouse,
} = require("../controllers/postsController");
const router = express.Router();
router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);
router.patch("/:id", updatePost);
router.get("/interests/:userId", getPostByInterests);
router.get("/fashion-house/:houseName", getPostsByFashionHouse);

module.exports = router;
