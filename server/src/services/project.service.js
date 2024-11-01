const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const messages = require("../messages.json");
const mongoose = require("mongoose");
const config = require("../configs/index");
const S3 = require("aws-sdk/clients/s3");

// Create S3 service object
const s3 = new S3({
  region: config.aws.s3.bucketRegion,
  accessKeyId: config.aws.s3.accessKeyId,
  secretAccessKey: config.aws.s3.secretKey,
});

// Model imports.
const ProjectModel = require("../models/project.model");

// Create a project.
const createAProject = async (reqBody, reqUser) => {
  const existingProject = await ProjectModel.findOne({
    // projectName: { $regex: reqBody.projectName, $options: "i" },
    projectName: reqBody.projectName,
    userId: new mongoose.Types.ObjectId(reqUser.id),
  });

  if (existingProject) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      messages.PROJECT_EXISTS_WITH_SAME_NAME
    );
  } else {
    const project = ProjectModel.create({
      projectName: reqBody.projectName,
      userId: reqUser.id,
    });

    if (project) {
      return project;
    }
  }
};

// Get all projects of a user.
const getAllProjectOfAUser = async (reqUser, reqQuery) => {
  const pageNumber = reqQuery.pageNumber || 1;
  const dataPerPage = reqQuery.dataPerPage || 10;

  const projects = await ProjectModel.find({
    userId: reqUser._id,
  })
    .skip(dataPerPage * (pageNumber - 1))
    .limit(dataPerPage)
    .sort({ createdAt: -1 });

  const totalProjectsCount = await ProjectModel.countDocuments({
    userId: reqUser._id,
  });

  return { projects, totalProjectsCount };
};

// Delete a project.
const deleteAProject = async (reqUser, reqParams) => {
  const project = await ProjectModel.findOne({
    _id: new mongoose.Types.ObjectId(reqParams.projectId),
    userId: reqUser._id,
  });

  if (project) {
    // Storing all files in an array which will be deleted.
    let files = [];
    if (!project?.modelImage?.includes("model-images")) {
      files = [
        ...project.productImages,
        ...project.finalImages,
        ...project.modelImage,
      ];
    } else {
      files = [...project.productImages, ...project.finalImages];
    }

    const bucketName = config.aws.s3.bucketName;

    for (const filename of files) {
      await deleteFileWithoutKey(bucketName, filename);
    }

    const deletedProject = await ProjectModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(reqParams.projectId),
      userId: reqUser._id,
    });

    if (deletedProject) {
      return deletedProject;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, messages.PROJECT_NOT_FOUND);
    }
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.PROJECT_NOT_FOUND);
  }
};

// Update a project.
const updateAProject = async (reqUser, reqBody) => {
  const project = await ProjectModel.findOne({
    _id: new mongoose.Types.ObjectId(reqBody.projectId),
    userId: reqUser._id,
  });

  if (project) {
    if (typeof reqBody.productImagePath === "array") {
      console.log(reqBody.productImagePath, "reqBody.productImagePath");
      reqBody.productImagePath.forEach((path) => {
        project.productImages.push(path);
      });

      project.modelImage = reqBody.modelImagePath;
      project.userAddedImages = true;

      const updatedProject = await project.save();
      return updatedProject;
    } else {
      project.modelImage = reqBody.modelImagePath;
      project.productImages = reqBody.productImagePath;
      project.userAddedImages = true;

      const updatedProject = await project.save();
      return updatedProject;
    }
  }

  // if (project) {
  //   if (
  //     reqBody.path.includes("/modelImage/") ||
  //     reqBody.path.includes("model-images")
  //   ) {
  //     if (project.step === 1) {
  //       project.modelImage = reqBody.path;
  //       project.step = 2;
  //       const updatedProject = await project.save();
  //       return updatedProject;
  //     }
  //   } else if (reqBody.path.includes("/productImage/")) {
  //     if (project.step === 2){
  //       project.productImage = reqBody.path;
  //       project.userAddedImages = true;
  //       project.step = 3;
  //       const updatedProject = await project.save();
  //       return updatedProject;
  //     }
  //   }
  // }
};

// Get a project.
const getAProject = async (reqUser, reqQuery) => {
  const project = await ProjectModel.findOne({
    _id: new mongoose.Types.ObjectId(reqQuery.projectId),
    userId: reqUser._id,
  });

  if (project) {
    return project;
  }
};

// Function to delete a files from AWS S3.
async function deleteFileWithoutKey(bucketName, filename) {
  const params = {
    Bucket: bucketName,
  };

  // List objects in the bucket
  const data = await s3.listObjectsV2(params).promise();

  // Find the file based on filename
  const fileToDelete = data.Contents.find((obj) =>
    filename.includes(obj.Key.split(" ")[0])
  );

  if (fileToDelete) {
    const deleteParams = {
      Bucket: bucketName,
      Key: fileToDelete.Key,
    };

    // Delete the file
    await s3.deleteObject(deleteParams).promise();
    console.log("File deleted successfully.");
  } else {
    console.log("File not found.");
  }
}

module.exports = {
  createAProject,
  getAllProjectOfAUser,
  deleteAProject,
  updateAProject,
  getAProject,
};
