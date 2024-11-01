const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const messages = require("../messages.json");
// const tokenService = require("./token.service");
const mongoose = require("mongoose");

// Model imports.
const ModelModel = require("../models/model.model");

// Get models service.
const getModels = async (reqBody) => {
  let modelRace = {};
  let modelGender = {};

  if (reqBody.modelRace === "all" && reqBody.modelGender !== "all") {
    modelRace = { modelRace: "" };
    modelGender = { modelGender: reqBody.modelGender };

    const models = await ModelModel.find({
      $or: [modelRace, modelGender],
    });
    return models;
  } else if (reqBody.modelGender === "all" && reqBody.modelRace !== "all") {
    modelRace = { modelRace: reqBody.modelRace };
    modelGender = { modelGender: "" };

    const models = await ModelModel.find({
      $or: [modelRace, modelGender],
    });
    return models;
  } else if (reqBody.modelRace === "all" && reqBody.modelGender === "all") {
    modelRace = { modelRace: "" };
    modelGender = { modelGender: "" };

    const models = await ModelModel.find();
    return models;
  } else {
    const models = await ModelModel.find(reqBody);
    return models;
  }
};

module.exports = {
  getModels,
};
