const catchAsync = require("../utils/catchAsync");
const messages = require("../messages.json");

// Sercice imports.
const authService = require("../services/auth.service");
const tokenService = require("../services/token.service");

// Login controller.
const login = catchAsync(async (req, res) => {
  const user = await authService.login(req.body);

  if (user && user.isVerified) {
    const tokens = await tokenService.generateAuthTokens(user);

    return res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.LOGIN_SUCCESS,
      },
      result: {
        data: user,
        tokens: {
          accessToken: tokens.access.token,
          refreshToken: tokens.refresh.token,
        },
      },
    });
  } else {
    return res.status(422).send({
      serverResponse: {
        code: 422,
        message: messages.USER_NOT_VERIFIED,
      },
      result: {
        data: user,
      },
    });
  }
});

// Register controller.
const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);

  if (user) {
    //   const tokens = await tokenService.generateAuthTokens(user);
    return res.status(201).send({
      serverResponse: {
        code: 201,
        message: messages.USER_REGISTRATION_SUCCESS_AND_VERIFY_EMAIL,
      },
      result: {
        data: user,
        //   tokens: {
        //     accessToken: tokens.access.token,
        //     refreshToken: tokens.refresh.token,
        //   },
      },
    });
  }
});

// Generate refresh token controller.
const generateRefreshToken = catchAsync(async (req, res) => {
  const tokens = await authService.generateRefreshToken(req.body.refreshToken);

  if (tokens) {
    res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.TOKENS_GENERATED_SUCCESSFULLY,
        result: {
          data: { ...tokens },
        },
      },
    });
  } else {
    res.status(400).send({
      serverResponse: {
        code: 400,
        message: messages.TOKEN_GENERATION_FAILED,
      },
    });
  }
});

const forgetPassword = catchAsync(async (req, res) => {
  const data = await authService.forgetPassword(req.body);
  if (data) {
    res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.SUCCESS,
        result: {
          data: data,
        },
      },
    });
  }
  // else {
  //   res.status(400).send({
  //     serverResponse: {
  //       code: 400,
  //       message: messages.TOKEN_GENERATION_FAILED,
  //     },
  //   });
  // }
});

const resetPassword = catchAsync(async (req, res) => {
  const data = await authService.resetPassword(req.body);

  if (data) {
    res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.SUCCESS,
        result: {
          data: data,
        },
      },
    });
  }
  // else {
  //   res.status(400).send({
  //     serverResponse: {
  //       code: 400,
  //       message: messages.TOKEN_GENERATION_FAILED,
  //     },
  //   });
  // }
});

const requestVerificationOTP = catchAsync(async (req, res) => {
  const data = await authService.sendUserVerifyOTP(req.body);
  if (data) {
    res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.OTP_SENT_SUCCESS,
        result: {
          data: data,
        },
      },
    });
  }
});

const verifyUser = catchAsync(async (req, res) => {
  const data = await authService.verifyUser(req.body);
  if (data) {
    res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.USER_VERIFIED_SUCCESS,
        result: {
          data: data,
        },
      },
    });
  }
});

module.exports = {
  login,
  register,
  generateRefreshToken,
  forgetPassword,
  resetPassword,
  requestVerificationOTP,
  verifyUser,
};
