const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const authHandlers = require('../handlers/auth/authHandlers');
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
  authHandlers.registerHandler
);

router.post(
  "/login",
  validator.body(loginSchema),
  authHandlers.loginHandler
);

router.post(
  "/reset",
  validator.body(resetSchema),
  authHandlers.resetHandler
);

router.post(
  "/verifyresettoken",
  validator.body(verifyResetTokenSchema),
  authHandlers.verifyResetTokenHandler
);

router.post(
  "/resetpassword",
  validator.body(resetPasswordSchema),
  authHandlers.resetPasswordHandler
);

router.get(
  "/refresh",
  authHandlers.refreshHandler
);

router.post(
  "/logout",
  validator.body(refreshSchema),
  authHandlers.logoutHandler
);

router.get(
  "/users",
  authMiddleware,
  authHandlers.usersHandler
);


module.exports = router;