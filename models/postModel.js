const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A post must have a creator"],
    },
    cheers: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    interests: {
      type: [String],
      required: [true, "A post must have tags"],
    },
    fashionHouse: {
      type: String,
      enum: [
        "The Dreamer",
        "The Rebel",
        "The Minimalist",
        "The Iconic",
        "The Trendsetter",
        "The Vintage Soul",
      ],
      required: [true, "A post must have a design house"],
    },
    prompt: String,
    collage: {
      type: String,
      required: [true, "A post must have a collage"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.pre("save", function (next) {
  if (this.isNew) this.timestamp = new Date();
  next();
});

const Post = new mongoose.model("Post", PostSchema);

module.exports = Post;
