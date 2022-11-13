const { User } = require("../../models/user/user.model");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const emailService = require("./email.service");
const localStorage = require("../storage/localStorage.service");
const { ApiError } = require("../../middleware/apiError");
const errors = require("../../config/errors");

module.exports.findUserByEmailOrUsername = async (
  emailOrUsername,
  role = "",
  withError = false
) => {
  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: { $eq: emailOrUsername } },
        { username: { $eq: emailOrUsername } },
      ],
    });

    // Throwing error if no user found and `throwError = true`
    if (withError && !user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    // Throwing error if a user was found but the specified `role` does not match
    // This happens in case of role is added as an argument
    // If role is falsy that means this search does not care of role
    if (withError && user && role && user.role !== role) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.foundWithInvalidRole;
      throw new ApiError(statusCode, message);
    }

    return user;
  } catch (err) {
    throw err;
  }
};

module.exports.findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    throw err;
  }
};

module.exports.validateToken = (token) => {
  try {
    return jwt.verify(token, process.env["JWT_PRIVATE_KEY"]);
  } catch (err) {
    throw err;
  }
};

module.exports.verifyIdentifier = async (key, user, code) => {
  try {
    // Ensure that key is correct
    key = key.toLowerCase();
    if (key !== "email") {
      key = "email";
    }

    // Check if user's email verified
    const isVerified = user.isEmailVerified();
    if (isVerified) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user[`${key}AlreadyVerified`];
      throw new ApiError(statusCode, message);
    }

    // Check if code is correct
    const isCorrectCode = user.isMatchingCode(`${key}VerificationCode`, code);
    if (!isCorrectCode) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.incorrectCode;
      throw new ApiError(statusCode, message);
    }

    // Check if code is expired
    const isValidCode = user.isValidCode(`${key}VerificationCode`);
    if (!isValidCode) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.expiredCode;
      throw new ApiError(statusCode, message);
    }

    // Verify user's email
    user.verifyEmail();

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.resendVerificationCode = async (key, user, lang) => {
  try {
    // Ensure that key is correct
    key = key.toLowerCase();
    if (key !== "email") {
      key = "email";
    }

    // Check if user's email is verified
    const isVerified = user.isEmailVerified();
    if (isVerified) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user[`${key}AlreadyVerified`];
      throw new ApiError(statusCode, message);
    }

    // Update user's email verification code
    // Send code in a message to user's email
    // Save user
    user.updateEmailVerificationCode();
    await user.save();

    // Sending email verification code to user's email
    await emailService.registerEmail(lang, user.email, user);
  } catch (err) {
    throw err;
  }
};

module.exports.changePassword = async (user, oldPassword, newPassword) => {
  try {
    // Decoding user's password and comparing it with the old password
    if (!(await user.comparePassword(oldPassword))) {
      const statusCode = httpStatus.UNAUTHORIZED;
      const message = errors.auth.incorrectOldPassword;
      throw new ApiError(statusCode, message);
    }

    // Update password
    await user.updatePassword(newPassword);

    await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.sendForgotPasswordCode = async (emailOrUsername, lang) => {
  try {
    // Check if user exists
    const user = await this.findUserByEmailOrUsername(emailOrUsername);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.emailOrUsernameNotUsed;
      throw new ApiError(statusCode, message);
    }

    // Update password reset code
    user.generatePasswordResetCode();
    const updatedUser = await user.save();

    await emailService.forgotPasswordEmail(lang, user.email, updatedUser);
  } catch (err) {
    throw err;
  }
};

module.exports.resetPasswordWithCode = async (
  emailOrUsername,
  code,
  newPassword
) => {
  try {
    // Check if user exists
    const user = await this.findUserByEmailOrUsername(emailOrUsername);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.emailNotUsed;
      throw new ApiError(statusCode, message);
    }

    // Check if code is correct
    const isCorrectCode = user.isMatchingCode("resetPasswordCode", code);
    if (!isCorrectCode) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.incorrectCode;
      throw new ApiError(statusCode, message);
    }

    // Check if code is expired
    const isValidCode = user.isValidCode("resetPasswordCode");
    if (!isValidCode) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.expiredCode;
      throw new ApiError(statusCode, message);
    }

    // Update password
    await user.updatePassword(newPassword);

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.updateProfile = async (
  lang,
  user,
  name,
  email,
  password,
  username,
  avatar
) => {
  try {
    const body = {
      lang,
      name,
      email,
      password,
      username,
      avatar,
    };

    return await updateUserProfile(user, body);
  } catch (err) {
    throw err;
  }
};

///////////////////////////// ADMIN /////////////////////////////
module.exports.changeUserRole = async (emailOrUsername, role) => {
  try {
    // Check if user exists
    const user = await this.findUserByEmailOrUsername(emailOrUsername);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    // Update user's role
    user.role = role;

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.verifyUser = async (emailOrUsername) => {
  try {
    // Check if used exists
    const user = await this.findUserByEmailOrUsername(emailOrUsername);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if user's email is already verified
    if (user.isEmailVerified()) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.alreadyVerified;
      throw new ApiError(statusCode, message);
    }

    // Verify user's email
    user.verifyEmail();

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.updateUserProfile = async (
  lang,
  emailOrUsername,
  name,
  email,
  password,
  username,
  avatar
) => {
  try {
    // Checking if user exists
    const user = await this.findUserByEmailOrUsername(emailOrUsername);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    const body = {
      lang,
      name,
      email,
      password,
      username,
      avatar,
    };

    return await updateUserProfile(user, body);
  } catch (err) {
    throw err;
  }
};

const updateUserProfile = async (user, body) => {
  try {
    const { name, avatar, password, email, username, lang } = body;

    // To detect updates
    let userChanged = false;

    // Updating name when there's new name
    if (name && user.name !== name) {
      user.name = name;
      userChanged = true;
    }

    // Updating avatar when there's new avatar
    if (avatar) {
      const file = await localStorage.storeFile(avatar);
      await localStorage.deleteFile(user.avatarURL);
      user.avatarURL = file.path;
      userChanged = true;
    }

    // Updating password when there's new password
    if (password) {
      await user.updatePassword(password);
      userChanged = true;
    }

    // Updating email, setting email as not verified,
    // update email verification code, and sending
    // email verification code to user's email
    if (email && user.email !== email) {
      // Checking if email used
      const emailUsed = await this.findUserByEmailOrUsername(email);
      if (emailUsed) {
        const statusCode = httpStatus.NOT_FOUND;
        const message = errors.auth.emailUsed;
        throw new ApiError(statusCode, message);
      }

      // Updating email, setting email as not verified,
      // update email verification code, and sending
      // email verification code to user's email
      user.email = email;
      user.verified.email = false;
      userChanged = true;
      user.updateEmailVerificationCode();
      await emailService.changeEmail(lang, email, user);
    }

    // Updating username
    if (username && user.username !== username) {
      // Checking if username used
      const usernameUsed = await this.findUserByEmailOrUsername(username);
      if (usernameUsed) {
        const statusCode = httpStatus.NOT_FOUND;
        const message = errors.auth.usernameUsed;
        throw new ApiError(statusCode, message);
      }

      // Updating email, setting email as not verified,
      // update email verification code, and sending
      // email verification code to user's email
      user.username = username;
      userChanged = true;
    }

    return userChanged ? await user.save() : user;
  } catch (err) {
    throw err;
  }
};
