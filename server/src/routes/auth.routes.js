const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");

// Controller imports.
const authController = require("../controllers/auth.controller");

// Validation imports.
const authValidation = require("../validations/auth.validation");

// Login route.
router.post(
  "/login",
  /* 	
  #swagger.tags = ['Auth']
  #swagger.description = 'Login API'

  #swagger.parameters['obj'] = {
      in: 'body',
      description: 'User login API.',
      required: true,
      schema: { 
        email: "viton-1@yopmail.com",
        password: "12345678A"
      }
    }

  #swagger.security = [{
      "apiKeyAuth": []
    }] 
  */
  validate(authValidation.login),
  authController.login
);

// Register route.
router.post(
  "/register",
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Registration API' */

  /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User registration API.',
            required: true,
            schema: { 
              firstName: "First name of the user",
              lastName: "Last name of the user",
              email: "example@example.com",
              password: "12345678A"
            }
    } */

  /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
  validate(authValidation.register),
  authController.register
);

// Get new token & refresh token.
router.post(
  "/token/refresh",
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Refresh-Token API' */

  /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Refresh-Token API.',
            required: true,
            schema: { 
              refreshToken: "refresh token",
            }
    } */

  /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
  validate(authValidation.refreshToken),
  authController.generateRefreshToken
);

// Get new token & refresh token.
router.post(
  "/forgot-password",
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Forget Password API' */

  /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Forget Password API.',
            required: true,
            schema: { 
              email: "example@example.com",
            }
    } */

  /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
  validate(authValidation.forgetPassword),
  authController.forgetPassword
);

router.post(
  "/reset-password",
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Refresh-Token API' */

  /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Refresh-Token API.',
            required: true,
            schema: { 
              otp: "123456",
              password: "12345678A"
            }
    } */

  /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
  validate(authValidation.resetPassword),
  authController.resetPassword
);

router.post(
  "/request-verification",
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'resend otp API' */

  /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'resend otp API.',
            required: true,
            schema: {
              email: "example@example.com",
            }
    } */

  /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
  validate(authValidation.forgetPassword),
  authController.requestVerificationOTP
);

router.post(
  "/verify-user",
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Verify user API' */

  /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Verify user API.',
            required: true,
            schema: {
              otp: "123456",
              email: "example@example.com",
            }
    } */

  /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
  validate(authValidation.verifyUser),
  authController.verifyUser
);

module.exports = router;
