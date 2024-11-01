const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");

// Controller imports.
const modelController = require("../controllers/model.controller");

// Validation imports.
// const authValidation = require("../validations/auth.validation");

// get models route.
router.post("/list", 
// validate(authValidation.login), 
modelController.getModels);

module.exports = router;