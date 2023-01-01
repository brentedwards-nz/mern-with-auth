const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const authController = require('../controllers/auth/authController');
const authMiddleware = require('../middleware/authMiddleware');

const passwordSchema = Joi.string().min(6).max(30).required();
const requireStringSchema = Joi.string().required();

const registerSchema = Joi.object({
  email: requireStringSchema,
  password: passwordSchema,
  firstName: Joi.string().min(2).max(20).required(),
  secondName: Joi.string().min(2).max(20).required(),
});

const loginSchema = Joi.object({
  email: requireStringSchema,
  password: passwordSchema,
});

const resetSchema = Joi.object({
  email: requireStringSchema,
});

const refreshSchema = Joi.object({
  email: requireStringSchema,
  password: passwordSchema,
});

const verifyResetTokenSchema = Joi.object({
  token: requireStringSchema,
});

const resetPasswordSchema = Joi.object({
  token: requireStringSchema,
  password: passwordSchema,
});

router.post(
  "/register",
  validator.body(registerSchema),
  authController.controllers.registerHandler
);

router.post(
  "/login",
  validator.body(loginSchema),
  authController.controllers.loginHandler
);

router.post(
  "/reset",
  validator.body(resetSchema),
  authController.controllers.resetHandler
);

router.post(
  "/verifyresettoken",
  validator.body(verifyResetTokenSchema),
  authController.controllers.verifyResetTokenHandler
);

router.post(
  "/resetpassword",
  validator.body(resetPasswordSchema),
  authController.controllers.resetPasswordHandler
);

router.get(
  "/refresh",
  authController.controllers.refreshHandler
);

router.post(
  "/logout",
  validator.body(refreshSchema),
  authController.controllers.logoutHandler
);

router.get(
  "/users",
  authMiddleware,
  authController.controllers.usersHandler
);


module.exports = router;