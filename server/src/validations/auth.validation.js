const Joi = require("joi");

// Password & ObjectID validation.
const { password } = require("./custom.validation");

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().custom(password).required(),
  }),
};

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().custom(password).required(),
  }),
};

const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgetPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    otp: Joi.string().required(),
    password: Joi.string().custom(password).required(),
  }),
}

const verifyUser = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    otp: Joi.string().required(),
  }),
}

module.exports = {
  login,
  register,
  refreshToken,
  forgetPassword,
  resetPassword,
  verifyUser
};
