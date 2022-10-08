const express = require("express");
const router = express.Router();
const testController = require('../controllers/test/testController');
const authMiddleware = require('../middleware/authMiddleware');

router.get(
  "/test",
  authMiddleware,
  testController.controllers.testHandler
);

module.exports = router;