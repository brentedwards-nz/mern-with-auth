const User = require("./userModel");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  time: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    required: true,
  }
});
const memberSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
    ref: "user",
  },
  isOwner: {
    type: Boolean,
  }
});

const chatroomSchema = new mongoose.Schema({
  roomTitle: { type: String },
  members: [memberSchema],
  messages: [messageSchema]
})

module.exports = mongoose.model("chatroom", chatroomSchema);