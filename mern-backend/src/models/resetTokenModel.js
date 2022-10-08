const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model("resetToken", resetTokenSchema);