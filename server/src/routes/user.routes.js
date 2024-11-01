const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

// Controller imports.
const userController = require("../controllers/user.controller");

//  route.
router.get(
  "/user",
  /* 	
  #swagger.tags = ['User']
  #swagger.description = 'Get a details of a user by token.'

  #swagger.security = [{
      "apiKeyAuth": []
    }] 
  */
  auth(),
  userController.getAnUserDetails
);

module.exports = router;
