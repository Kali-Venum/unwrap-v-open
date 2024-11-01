const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("../configs/index");

// Models.
const TokenModel = require("../models/token.model");

// Token Types.
const { tokenTypes } = require("../configs/types/token.types");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  userId,
  email,
  expires,
  type,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    email,
    iat: Date.now(),
    expires,
    type,
  };

  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  // Delete previous tokens.
  await TokenModel.deleteMany({ user: new mongoose.Types.ObjectId(userId) });

  const tokenDoc = await TokenModel.create({
    token,
    user: userId,
    expires,
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await TokenModel.findOne({
    token,
    type,
    user: payload.sub,
    // blacklisted: false,
  });

  if (!tokenDoc) {
    throw new Error("Token not found");
  } else {
    return tokenDoc;
  }
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = new Date(Date.now() + 20 * 60 * 1000);
  // const accessTokenExpires = 60000; // Temp:- for development perpous.
  const accessToken = generateToken(
    user.id,
    user.email,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = new Date(Date.now() + 20 * 60 * 10000);
  // const refreshTokenExpires = 60000; // Temp:- for development perpous.
  const refreshToken = generateToken(
    user.id,
    user.email,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
};
