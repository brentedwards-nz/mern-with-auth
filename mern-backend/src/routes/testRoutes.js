const express = require("express");
const router = express.Router();
const testHandlers = require('../handlers/test/testHandlers');
const authMiddleware = require('../middleware/authMiddleware');

router.get(
  "/test",
  authMiddleware,
  testHandlers.testHandler
);

module.exports = router;