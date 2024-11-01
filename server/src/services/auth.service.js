const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const messages = require("../messages.json");
const tokenService = require("./token.service");
const { sendOTPUsingEmail } = require("./email.service");
const otpGenerator = require("otp-generator");

// Model imports.
const UserModel = require("../models/user.model");
const TokenModel = require("../models/token.model");
const OTPModel = require("../models/otp.model");

// Token Types.
const { tokenTypes } = require("../configs/types/token.types");

const login = async (reqBody) => {
  const user = await UserModel.findOne({
    email: reqBody.email,
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.EMAIL_NOT_REGISTERED);
  } else {
    if (user.isBlocked === true) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        messages.YOUR_PROFILE_IS_BLOCKED_BY_ADMIN
      );
    } else if (!user.isVerified) {
      return user;
    } else {
      const checkedPassword = await bcrypt.compare(
        reqBody.password,
        user.password
      );
      if (checkedPassword) {
        return user;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          messages.INVALID_EMAIL_AND_PASSWORD
        );
      }
    }
  }
};

const register = async (reqBody) => {
  const existingUser = await UserModel.findOne({
    email: reqBody.email,
    isVerified: true,
  });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.USER_ALREADY_EXISTS);
  } else {
    // Hasing the password.
    const password = await bcrypt.hash(reqBody.password, 10);

    const newUser = new UserModel({
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
      email: reqBody.email,
      password,
      isVerified: false,
    });

    const user = await newUser.save();

    if (user) {
      const generatedOtp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      const bcryptedOTP = await bcrypt.hash(generatedOtp, 10);

      //Function to send otp to user
      await sendOTPUsingEmail(reqBody.email, generatedOtp, "Verify user OTP");

      await OTPModel.create({
        email: reqBody.email,
        userId: user._id,
        otp: bcryptedOTP,
      });

      return user;
    }
  }
};

// Create a new token & refresh token.
const generateRefreshToken = async (refreshToken) => {
  const refreshTokenDoc = await tokenService.verifyToken(
    refreshToken,
    tokenTypes.REFRESH
  );

  if (refreshTokenDoc) {
    const user = await UserModel.findById(refreshTokenDoc.user);

    if (!user) {
      throw new Error();
    } else {
      await TokenModel.deleteMany({ _id: refreshTokenDoc._id });
      return await tokenService.generateAuthTokens(user);
    }
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, messages.PLEASE_AUTHENTICATE);
  }
};

const sendUserVerifyOTP = async (reqBody) => {
  const existingUser = await UserModel.findOne({
    email: reqBody.email,
    isVerified: false,
  });
  const existingOtp = await OTPModel.findOne({ email: reqBody.email });
  if (existingOtp) {
    await OTPModel.findOneAndDelete({
      email: reqBody.email,
    });
  }

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.USER_NOT_FOUND);
  } else {
    const generatedOtp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const bcryptedOTP = await bcrypt.hash(generatedOtp, 10);

    //Function to send otp to user
    await sendOTPUsingEmail(reqBody.email, generatedOtp, "Verify user OTP");

    const otp = await OTPModel.create({
      email: reqBody.email,
      userId: existingUser._id,
      otp: bcryptedOTP,
    });
    return otp;
  }
};

const verifyUser = async (reqBody) => {
  const user = await UserModel.findOne({
    email: reqBody.email,
    isVerified: false,
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.EMAIL_NOT_REGISTERED);
  } else {
    const { email, otp } = reqBody;
    const existingOTP = await OTPModel.findOne({ email: email });
    const checkOtp = await bcrypt.compare(otp, existingOTP.otp);

    if (!existingOTP || !checkOtp) {
      throw new ApiError(httpStatus.BAD_REQUEST, messages.INVALID_OTP);
    } else {
      user.isVerified = true;

      const updatedUser = await user.save();
      return updatedUser;
    }
  }
};

const forgetPassword = async (reqBody) => {
  const existingUser = await UserModel.findOne({ email: reqBody.email });
  // console.log(reqBody.email);
  const existingOtp = await OTPModel.findOne({ email: reqBody.email });
  if (existingOtp) {
    await OTPModel.findOneAndDelete({
      email: reqBody.email,
    });
  }

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.USER_NOT_FOUND);
  } else {
    const generatedOtp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const bcryptedOTP = await bcrypt.hash(generatedOtp, 10);

    //Function to send otp to user
    await sendOTPUsingEmail(reqBody.email, generatedOtp, "Forgot Password OTP");

    const otp = await OTPModel.create({
      email: reqBody.email,
      userId: existingUser._id,
      otp: bcryptedOTP,
    });
    return otp;
  }
};

const resetPassword = async (reqBody) => {
  const { email, otp, password } = reqBody;
  const existingOTP = await OTPModel.findOne({ email: email });
  const checkOtp = await bcrypt.compare(otp, existingOTP.otp);

  if (!existingOTP || !checkOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.INVALID_OTP);
  } else {
    const user = await UserModel.findById(existingOTP.userId);

    // Hasing the password.
    const newPassword = await bcrypt.hash(password, 10);

    if (user) {
      user.password = newPassword;

      const updatedUser = await user.save();

      return updatedUser;
    }
  }
};

module.exports = {
  login,
  register,
  generateRefreshToken,
  forgetPassword,
  resetPassword,
  sendUserVerifyOTP,
  verifyUser,
};
