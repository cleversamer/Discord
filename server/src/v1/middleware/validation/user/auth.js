const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const loginValidator = [
  commonMiddleware.checkEmailOrUsername,
  commonMiddleware.checkPassword,
  commonMiddleware.next,
];

const registerValidator = [
  commonMiddleware.checkLanguage,
  commonMiddleware.checkName,
  commonMiddleware.checkEmail,
  commonMiddleware.checkUsername,
  commonMiddleware.checkPassword,
  commonMiddleware.checkRole(true),
  commonMiddleware.next,
];

const changePasswordValidator = [
  commonMiddleware.checkOldPassword,
  commonMiddleware.checkNewPassword,
  commonMiddleware.next,
];

const forgotPasswordValidator = [
  commonMiddleware.checkEmailOrUsername,
  commonMiddleware.checkNewPassword,
  commonMiddleware.checkCode,
  commonMiddleware.next,
];

const getForgotPasswordCode = [
  (req, res, next) => {
    req.query.emailOrUsername = req.query?.emailOrUsername?.toLowerCase();
    req.query.lang = req.query?.lang?.toLowerCase();

    req.body.emailOrUsername = req.query.emailOrUsername;
    req.body.lang = req.query.lang;

    next();
  },

  commonMiddleware.checkEmailOrUsername,

  commonMiddleware.checkLanguage,

  commonMiddleware.next,
];

const emailValidator = [commonMiddleware.checkEmail, commonMiddleware.next];

const codeValidator = [commonMiddleware.checkCode, commonMiddleware.next];

const resendCodeValidator = [
  (req, res, next) => {
    req.body.lang = req.query.lang;

    next();
  },

  commonMiddleware.checkLanguage,

  commonMiddleware.next,
];

module.exports = {
  loginValidator,
  registerValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  emailValidator,
  getForgotPasswordCode,
  codeValidator,
  resendCodeValidator,
};
