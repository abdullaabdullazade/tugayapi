const mongoose = require("mongoose");

const photoSheme = new mongoose.Schema({
  photoname: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const photoList = mongoose.model("photos", photoSheme);

module.exports = photoList;
