const ProjectModel = require("../models/project.model");

const getProjectsCount = async (reqUser) => {
  const projectsCount = await ProjectModel.countDocuments({
    userId: reqUser._id,
  });
  
  return projectsCount;
};

module.exports = {
  getProjectsCount,
};
