const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstName: { type: String },
  secondName: { type: String },
  password: { type: String },
  isCurrent: { type: Boolean, default: true },
  usertypes: [{
    usertype: {
      type: String,
      enum: ['user', 'admin', 'guest'],
      default: 'user'
    }
  }]
})

module.exports = mongoose.model("user", userSchema);