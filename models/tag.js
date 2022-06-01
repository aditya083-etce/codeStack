const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("tag", TagSchema);