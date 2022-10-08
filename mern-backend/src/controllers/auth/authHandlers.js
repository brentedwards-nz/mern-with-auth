const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemon = require("nodemon");

const User = require("../../models/userModel");
const ResetToken = require("../../models/resetTokenModel");
const Email = require("../../services/email");

const jwtCookieName = "jwt";

const registerHandler = async (req, res) => {
  try {
    const { email, password, firstName, secondName } = req.body;

    const userExists = await User.exists({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).send("E-mail already in use.");
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user document and save in database
    const user = await User.create({
      firstName,
      secondName,
      email: email.toLowerCase(),
      password: encryptedPassword,
      isCurrent: true,
      usertypes: [{ usertype: 'user' }]
    });

    // create JWT token
    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_ENCRYPTION_TOKEN,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ENCRYPTION_REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    res.cookie(jwtCookieName, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      userDetails: {
        email: user.email,
        token: token,
        firstName: user.firstName,
        secondName: user.secondName,
      },
    });

  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isCurrent) {
      console.log("Could not find user");
      return res.status(400).send("Invalid credentials. Please try again");
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    if (!(await bcrypt.compare(password, user.password))) {
      console.log("Password incorrect");
      return res.status(400).send("Invalid credentials. Please try again");
    }

    if (user.usertypes.length <= 0) {
      return res.status(401).send("Not authorized. Please try again");
    }

    // create JWT token
    const token = jwt.sign({ userId: user._id, email },
      process.env.JWT_ENCRYPTION_TOKEN,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ENCRYPTION_REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    res.cookie(jwtCookieName, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      userDetails: {
        email: user.email,
        firstName: user.firstName,
        secondName: user.secondName,
      },
    });

  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

const resetHandler = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isCurrent) {
      console.log("Could not find user");
      return res.status(200).send("Please check email");
    }

    const token = jwt.sign({ userId: user._id, email },
      process.env.JWT_ENCRYPTION_RESET_TOKEN,
      { expiresIn: "1h" }
    );

    let resetToken = await ResetToken.findOne({ userId: user._id });
    if (!resetToken) {
      const resetToken = await ResetToken.create({
        userId: user._id,
        token: token
      });
    } else {
      resetToken.token = token;
      await resetToken.save().catch(err => {
        console.log("Could not save reset password token", err);
        return res.status(500).send("Error occured. Please try again");
      });
    }

    const link = `${process.env.FRONTEND_BASE_URL}/reset-password/${token}`;
    const result = await Email.sendEmail(email.toLowerCase(), "Password reset", link);
    if (result) {
      return res.status(200).send("Please check email");
    }
    return res.status(500).send("Error occured. Please try again");

  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

const logoutHandler = async (req, res) => {
  return res.status(200).json({
    logoutHandler: {
      success: true,
    },
  });
};

const refreshHandler = async (req, res) => {
  console.log("refreshHandler: " + req)

  const cookies = req.cookies;

  if (!cookies[jwtCookieName]) {
    console.log(`No jwt cookie: ${cookies?.jwt}`)
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(200).json({
    refreshHandler: {
      success: true,
    },
  });
};

const verifyResetTokenHandler = async (req, res) => {
  try {
    const { token } = req.body;
    const { userId, email } = jwt.verify(token, process.env.JWT_ENCRYPTION_RESET_TOKEN);

    const user = await User.findOne({ userId: userId, email: email.toLowerCase() });
    if (!user || !user.isCurrent) {
      console.log("Could not find user");
      return res.status(500).send(" Reset token is invalid");
    }

    const resetToken = await ResetToken.findOne({ userId: userId });
    if (!resetToken) {
      console.log("Could not find reset token");
      return res.status(500).send(" Reset token is invalid");
    }

    if (resetToken.token !== token) {
      console.log("Token was invalid");
      return res.status(500).send("Reset token is invalid");
    }

    return res.status(200).send("Token was valid");
  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Failed to vailidate reset token");
  }
};

const resetPasswordHandler = async (req, res) => {
  try {
    console.log("*** Reset Password Handler ***")
    const { token, password } = req.body;
    const { userId, email } = jwt.verify(token, process.env.JWT_ENCRYPTION_RESET_TOKEN);

    const user = await User.findOne({ userId: userId, email: email.toLowerCase() });
    if (!user || !user.isCurrent) {
      console.log("Could not find user");
      return res.status(500).send("Could not reset password");
    }

    const resetToken = await ResetToken.findOne({ userId: userId });
    if (!resetToken) {
      console.log("Could not find reset token");
      return res.status(500).send(" Reset token is invalid");
    }

    if (resetToken.token !== token) {
      console.log("Token was invalid");
      return res.status(500).send("Reset token is invalid");
    }

    await resetToken.remove();

    const encryptedPassword = await bcrypt.hash(password, 10);
    user.password = encryptedPassword;
    await user.save();

    return res.status(200).send("Password successfully reset");

  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  resetHandler,
  verifyResetTokenHandler,
  resetPasswordHandler
};
