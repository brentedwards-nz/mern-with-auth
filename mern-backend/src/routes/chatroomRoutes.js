const express = require("express");
const router = express.Router();
const handlers = require('../handlers/chatroom/chatroomHandlers');
const authMiddleware = require('../middleware/authMiddleware');

const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const requireStringSchema = Joi.string().required();

const registerSchema = Joi.object({
  roomTitle: requireStringSchema,
});


router.post(
  "/",
  authMiddleware,
  handlers.createChatRoomHandler
);

router.get(
  "/",
  authMiddleware,
  handlers.getConversationsHandler
);

router.get(
  "/:roomId",
  authMiddleware,
  handlers.getChatRoomHandler
);

router.post(
  "/:roomId/message",
  authMiddleware,
  handlers.createMessageHandler
);
module.exports = router;