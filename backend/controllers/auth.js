const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
      confirmed: false,
    });

    const confirmedToken = user.getConfirmedToken();
    await user.save();
    const confirmUrl = `http://localhost:3000/confirmregistration/${confirmedToken}`;
    const message = `<h1>You have create a new account</h1>
    <p>Please go to this link to confirm your  registration</p>
    <a href=${confirmUrl} clicktracking=off/>${confirmUrl}</a>`;
    try {
      sendEmail({
        to: email,
        subject: "Confirm Registration",
        text: message,
      });
      res.status(200).json({ success: true, data: "Email was send" });
    } catch (error) {
      user.confirmPasswordToken = undefined;
      await user.save();

      return next(new ErrorResponse("Email could not be send", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.confirmRegistration = async (req, res, next) => {
  const confirmPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.confirmToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      confirmPasswordToken,
    });
    if (!user) {
      return next(new ErrorResponse("Invalid confirm token", 400));
    }
    const jwtToken = user.getSignedToken();
    user.confirmPasswordToken = undefined;
    user.confirmed = true;

    await user.save();
    res.status(201).json({
      success: true,
      data: "Confirmed registration",
      jwtToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password"), 400);
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid email", 400));
    }

    if (user.confirmed == false) {
      return next(new ErrorResponse("Please confirmed your account.", 400));
    }
    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid password", 404));
    }
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    //Template for the verification email
    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `<h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off/>${resetUrl}</a>`;

    try {
      sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email was send" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be send", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    res.status(201).json({
      success: true,
      data: "Password reset success",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
