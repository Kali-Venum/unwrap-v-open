const catchAsync = require("../utils/catchAsync");
const messages = require("../messages.json");

// imports.
const projectService = require("../services/project.service");

// Create a project controller.
const createAProject = catchAsync(async (req, res) => {
  const project = await projectService.createAProject(req.body, req.user);

  if (project) {
    return res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.PROJECT_CREATED,
      },
      result: {
        data: project,
      },
    });
  }
});

// Get all projects controller.
const getAllProjectOfAUser = catchAsync(async (req, res) => {
  const { projects, totalProjectsCount } =
    await projectService.getAllProjectOfAUser(req.user, req.query);

  if (projects) {
    return res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.SUCCESS,
      },
      result: {
        data: projects,
        totalDataCount: totalProjectsCount,
        pageNumber: parseInt(req.query.pageNumber) || 1,
        dataPerPage: parseInt(req.query.dataPerPage) || 10,
      },
    });
  }
});

// Delete a project.
const deleteAProject = catchAsync(async (req, res) => {
  const project = await projectService.deleteAProject(req.user, req.params);

  if (project) {
    return res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.PROJECT_CREATED,
      },
      result: {
        data: project,
      },
    });
  }
});

// Update a project.
const updateAProject = catchAsync(async (req, res) => {
  const project = await projectService.updateAProject(req.user, req.body);

  if (project) {
    return res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.PROJECT_UPDATED,
      },
      result: {
        data: project,
      },
    });
  }
});

// Get the details of a project.
const getAProject = catchAsync(async (req, res) => {
  const project = await projectService.getAProject(req.user, req.params);

  if (project) {
    return res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.SUCCESS,
      },
      result: {
        data: project,
      },
    });
  }
});

module.exports = {
  createAProject,
  getAllProjectOfAUser,
  deleteAProject,
  updateAProject,
  getAProject,
};
