const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./index");

// Token Types.
const { tokenTypes } = require("./types/token.types");

// Models.
const UserModel = require("../models/user.model");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }

    const user = await UserModel.findById(payload.sub);

    if (!user) {
      return done("Pass the authentication token", false);
    }
    done(null, user);
  } catch (error) {
    done("Pass the authentication token", false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
