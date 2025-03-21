const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const speakeasy = require("speakeasy");
//limit the things returned from the database
// remove pasword and otpsecret from the response
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
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
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must confirm their password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
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
});
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

//To check if the password is correct (when a person logs in)
UserSchema.methods.comparePasswords = async function (
  userPassword,
  hashedPassword
) {
  return await bcryptjs.compare(userPassword, hashedPassword);
};

//To check if the password was changed after the token was issued
// UserSchema.methods.passwordChangedAfter = function (jwtTimeStamp) {
//   if (this.passwordChangedAt) {
//     const passwordTime = this.passwordChangedAt.getTime();
//     console.log(passwordTime / 1000);
//     return passwordTime / 1000 > jwtTimeStamp;
//   }
//   return false;
// };

const User = new mongoose.model("User", UserSchema);

module.exports = User;
