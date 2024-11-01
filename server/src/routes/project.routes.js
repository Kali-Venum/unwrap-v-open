const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

// Controller imports.
const projectController = require("../controllers/project.controller");

// Validation imports.
const projectValidation = require("../validations/project.validation");

// Create a new project.
router.post(
  "/create",
  /*
    #swagger.tags = ['Project']
    #swagger.description = 'Create a project API'
  
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Create a project API.',
        required: true,
        schema: {
          projectName: "Your project name"
        }
    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]
  */
  auth(),
  validate(projectValidation.createAProject),
  projectController.createAProject
);

// Get all projects.
router.get(
  "/list",
  /*
    #swagger.tags = ['Project']
    #swagger.description = 'Create a project API'
    #swagger.consumes = ['multipart/form-data']

    #swagger.parameters['pageNumber'] = {
        in: 'query',
        description: 'Enter the page number.',
        required: true,
    }

    #swagger.parameters['dataPerPage'] = {
        in: 'query',
        description: 'Enter the data count for per page.',
        required: true,
    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]
  */
  auth(),
  validate(projectValidation.getAllProjectOfAUser),
  projectController.getAllProjectOfAUser
);

// Delete a project.
router.delete(
  "/delete/:projectId",
  /*
    #swagger.tags = ['Project']
    #swagger.description = 'Delete a project API'
  
    #swagger.parameters['projectId'] = {
        in: 'path',
        description: 'Delete a project API.',
        required: true,
        schema: {
          projectId: "Your project ID"
        }
    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]
  */
  auth(),
  validate(projectValidation.deleteAProject),
  projectController.deleteAProject
);

// Update a project.
router.patch(
  "/update",
  /*
    #swagger.tags = ['Project']
    #swagger.description = 'Update a project API'
  
    #swagger.parameters['Body'] = {
        in: 'body',
        description: 'Update a project API.',
        required: true,
        schema: {
          projectId: "Your project ID",
          modelImagePath: "Enter the model image path",
          productImagePath: "Enter the product image path"
        }
    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]
  */
  auth(),
  validate(projectValidation.updateAProject),
  projectController.updateAProject
);

// Get a project by project Id.
router.get(
  "/get/:projectId",
  /*
    #swagger.tags = ['Project']
    #swagger.description = 'Get a project by id API'
  
    #swagger.parameters['projectId'] = {
        in: 'path',
        description: 'Get a project by ID API.',
        required: true,
        schema: {
          projectId: "Your project ID"
        }
    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]
  */
  auth(),
  validate(projectValidation.getAProject),
  projectController.getAProject
);

module.exports = router;
