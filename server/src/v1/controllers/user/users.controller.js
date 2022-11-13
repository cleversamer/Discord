const httpStatus = require("http-status");
const _ = require("lodash");
const { CLIENT_SCHEMA } = require("../../models/user/user.model");
const { usersService } = require("../../services");
const success = require("../../config/success");

module.exports.isAuth = async (req, res, next) => {
  try {
    req.user.updateLastLogin();
    const user = await req.user.save();

    res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.verifyIdentifier = (key) => async (req, res, next) => {
  try {
    const user = req.user;
    const { code } = req.body;

    const verifiedUser = await usersService.verifyIdentifier(key, user, code);

    res.status(httpStatus.OK).json(_.pick(verifiedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.resendVerificationCode = (key) => async (req, res, next) => {
  try {
    const user = req.user;
    const { lang } = req.query;

    await usersService.resendVerificationCode(key, user, lang);

    const response = {
      ok: true,
      message: success.auth[`${key}VerificationCodeSent`],
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.changePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    await usersService.changePassword(user, oldPassword, newPassword);

    const response = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.sendForgotPasswordCode = async (req, res, next) => {
  try {
    const { emailOrUsername, lang } = req.query;

    await usersService.sendForgotPasswordCode(emailOrUsername, lang);

    const response = {
      ok: true,
      message: success.auth.passwordResetCodeSentToEmail,
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.handleForgotPassword = async (req, res, next) => {
  try {
    const { emailOrUsername, code, newPassword } = req.body;

    const user = await usersService.resetPasswordWithCode(
      emailOrUsername,
      code,
      newPassword
    );

    res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, email, username, password, lang } = req.body;
    const avatar = req?.files?.avatar || null;

    const updatedUser = await usersService.updateProfile(
      lang,
      user,
      name,
      email,
      password,
      username,
      avatar
    );

    const response = {
      user: _.pick(updatedUser, CLIENT_SCHEMA),
      token: updatedUser.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

///////////////////////////// ADMIN /////////////////////////////
module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const {
      lang = "ar",
      emailOrUsername,
      name,
      email,
      password,
      username,
    } = req.body;
    const avatar = req?.files?.avatar || null;

    const updatedUser = await usersService.updateUserProfile(
      lang,
      emailOrUsername,
      name,
      email,
      password,
      username,
      avatar
    );

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUser = async (req, res, next) => {
  try {
    const { emailOrUsername } = req.body;

    const updatedUser = await usersService.verifyUser(emailOrUsername);

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.changeUserRole = async (req, res, next) => {
  try {
    const { emailOrUsername, role } = req.body;

    const updatedUser = await usersService.changeUserRole(
      emailOrUsername,
      role
    );

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.findUserByEmailOrUsername = async (req, res, next) => {
  try {
    const { role, id: emailOrUsername } = req.params;

    const user = await usersService.findUserByEmailOrUsername(
      emailOrUsername,
      role,
      true
    );

    res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};
