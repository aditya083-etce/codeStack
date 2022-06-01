const mongoose = require("mongoose");

const UserDefinedTagSchema = mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
});

module.exports = mongoose.model("userDefinedTag", UserDefinedTagSchema);