const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const speakeasy = require("speakeasy");
//limit the things returned from the database
// remove pasword and otpsecret from the response
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    }, //this
    username: {
      type: String,
      required: [true, "A user must have a username"],
      unique: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9_]{2,}$/.test(value);
        },
        message: "Invalid username",
      },
    },
    description: {
      type: String,
      default: "I am a fashion enthusiast",
    }, //this
    email: {
      type: String,
      unique: true,
      required: [true, "A user must have an email"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minLength: 8,
      select: false,
    }, //this
    passwordConfirm: {
      type: String,
      required: [true, "A user must confirm their password"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
      select: false,
    },
    photo: {
      type: String,
      default: "default-user",
    },

    passwordChangedAt: Date,
    active: Boolean,
    otpsecret: {
      type: String,
      select: false,
    },
    stickers: {
      type: [
        {
          category: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
          url: {
            type: String,
            required: true,
          },
          position: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    designHouse: {
      type: String,
      enum: [
        "The Dreamer",
        "The Rebel",
        "The Minimalist",
        "The Iconic",
        "The Trendsetter",
        "The Vintage Soul",
        "The Explorer",
        "The Romantic",
      ],
      required: [true, "A user must have a design house"],
    }, //this
    interests: {
      type: [String],
      enum: [
        "casual",
        "formal",
        "streetwear",
        "athleisure",
        "bohemian",
        "vintage",
        "gothic",
        "preppy",
        "punk",
        "minimalist",
        "maximalist",
        "artistic",
        "eclectic",
        "androgynous",
        "romantic",
        "Y2K",
        "grunge",
        "chic",
      ],
      validate: {
        validator: function (v) {
          return v.length >= 5;
        },
        message: "You must select at least 5 styling interests.",
      },
    },
  },

  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.otpsecret;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);
//To securely store the password in database
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 12);
    //hashing the password to secure
    this.passwordConfirm = undefined;
    if (this.isNew) {
      // Generate a unique secret for each user
      this.otpsecret = speakeasy.generateSecret({ length: 20 }).base32;
    }
  }
  next();
});

//to update the passwordChangedAt property when the password is changed
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

UserSchema.methods.comparePasswords = async function (userPassword) {
  return await bcryptjs.compare(userPassword, this.password);
};

const User = new mongoose.model("User", UserSchema);

module.exports = User;
