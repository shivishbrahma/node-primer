const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const requiredString = {
  type: String,
  required: true,
};

// Defining User Schema
const userSchema = new Schema({
  name: {
    ...requiredString,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    ...requiredString,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    ...requiredString,
    minlength: 3,
    maxlength: 255,
  },
  //give different access rights if admin or not
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.API_KEY,
    { expiresIn: "24h" },
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
