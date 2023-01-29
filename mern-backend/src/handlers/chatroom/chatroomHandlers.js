const { model } = require("mongoose");
const ChatRoom = require("../../models/chatroomModel");
const User = require("../../models/userModel");

const createChatRoomHandler = async (req, res) => {
  try {
    console.log(`createChatRoomHandler`);
    const { roomTitle, members } = req.body;

    // create user document and save in database
    const chatroom = await ChatRoom.create({
      roomTitle,
      members
    });

    return res.status(200).send(`Create Chat Room Handler: ${chatroom._id} : ${roomTitle}`);
  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

const getChatRoomHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const roomId = req.params.roomId
    //console.log(`getChatRoomHandler: ${roomId}`);

    const chats = await ChatRoom
      .findById(roomId)
      .populate({
        path: 'members',
        select: { _id: 0 },
        populate: {
          path: 'userId',
          model: 'user',
          select: { _id: 1, firstName: 1, secondName: 1 }
        }
      })
      .populate({
        path: 'messages',
        select: { _id: 0 },
        populate: {
          path: 'userId',
          model: 'user',
          select: {
            _id: 1,
            firstName: 1,
            secondName: 1,
            isMe: { $eq: ['$_id', { $toObjectId: userId }] },
          },
        }
      })
      .select({ _id: 0, roomTitle: 1 });

    return res.status(200).send(chats);
  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

const getConversationsHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(`getConversationsHandler: ${userId}`);

    const chats = await ChatRoom
      .find({ 'members': { $elemMatch: { userId: { _id: userId } } } })
      .populate({
        path: 'members',
        select: { _id: 0 },
        populate: {
          path: 'userId',
          model: 'user',
          select: { _id: 1, firstName: 1, secondName: 1 }
        }
      })
      .select({ _id: 1, roomTitle: 1 });

    return res.status(200).send(chats);
  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

const createMessageHandler = async (req, res) => {
  try {
    const roomId = req.params.roomId
    const userId = req.user.userId;
    const { message } = req.body;
    console.log(`createMessageHandler: ${roomId}`);

    const chats = await ChatRoom.updateOne(
      { "_id": roomId },
      {
        $push: {
          messages: {
            userId: userId,
            message: message
          }
        }
      }
    );

    console.table(chats);

    return res.status(200).send(chats);
  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};


module.exports = {
  createChatRoomHandler,
  getChatRoomHandler,
  createMessageHandler,
  getConversationsHandler
};