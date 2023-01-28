const express = require("express");
const router = express.Router();
const handlers = require('../handlers/data/dataHandlers');
const authMiddleware = require('../middleware/authMiddleware');

router.get(
  "/tracks",
  authMiddleware,
  handlers.tracksHandler
);

module.exports = router;