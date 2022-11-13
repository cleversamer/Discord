const { authService, emailService } = require("../../services");
const httpStatus = require("http-status");
const { CLIENT_SCHEMA } = require("../../models/user/user.model");
const _ = require("lodash");

module.exports.register = async (req, res, next) => {
  try {
    const { lang, name, email, username, password, role } = req.body;

    const user = await authService.register(
      email,
      password,
      name,
      username,
      role
    );

    await emailService.registerEmail(lang, email, user);

    const response = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await authService.login(emailOrUsername, password);

    const response = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
