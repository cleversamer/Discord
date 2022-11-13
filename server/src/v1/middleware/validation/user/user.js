const commonMiddleware = require("../common");

const validateUpdateProfile = [
  commonMiddleware.checkLanguage,
  commonMiddleware.conditionalCheck("name", commonMiddleware.checkName),
  commonMiddleware.checkFile("avatar", ["png", "jpg", "jpeg"], false),
  commonMiddleware.conditionalCheck("email", commonMiddleware.checkEmail),
  commonMiddleware.conditionalCheck("Username", commonMiddleware.checkUsername),
  commonMiddleware.conditionalCheck("password", commonMiddleware.checkPassword),
  commonMiddleware.next,
];

const validateUpdateUserProfile = [
  commonMiddleware.checkEmailOrUsername,
  ...validateUpdateProfile,
];

const validateUpdateUserRole = [
  commonMiddleware.checkEmailOrUsername,

  commonMiddleware.checkRole(true),

  commonMiddleware.next,
];

const validateVerifyUser = [
  commonMiddleware.checkEmailOrUsername,
  commonMiddleware.next,
];

const validateFindUserByEmailOrUsername = [
  (req, res, next) => {
    req.body.emailOrUsername = req?.params?.id?.toLowerCase();
    req.body.role = req?.params?.role?.toLowerCase();

    next();
  },

  commonMiddleware.checkEmailOrUsername,

  commonMiddleware.checkRole(true),

  commonMiddleware.next,
];

module.exports = {
  validateUpdateProfile,
  validateUpdateUserProfile,
  validateUpdateUserRole,
  validateVerifyUser,
  validateFindUserByEmailOrUsername,
};
