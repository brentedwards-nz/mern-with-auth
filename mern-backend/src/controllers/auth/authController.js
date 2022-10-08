const auth = require("./authHandlers");

const registerHandler = auth.registerHandler;
const loginHandler = auth.loginHandler;
const logoutHandler = auth.logoutHandler;
const refreshHandler = auth.refreshHandler;
const resetHandler = auth.resetHandler;
const verifyResetTokenHandler = auth.verifyResetTokenHandler;
const resetPasswordHandler = auth.resetPasswordHandler;

exports.controllers = {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  resetHandler,
  verifyResetTokenHandler,
  resetPasswordHandler
};