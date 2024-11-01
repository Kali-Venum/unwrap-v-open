const catchAsync = require("../utils/catchAsync");
const messages = require("../messages.json");

const dashboardService = require("../services/dashboard.service");

// Get projects count controller.
const getProjectsCount = catchAsync(async (req, res) => {
  const projectCount = await dashboardService.getProjectsCount(req.user);

  return res.status(200).send({
    serverResponse: {
      code: 200,
      message: messages.SUCCESS,
    },
    result: {
      totalProjects: projectCount,
    },
  });
});

module.exports = {
  getProjectsCount,
};
