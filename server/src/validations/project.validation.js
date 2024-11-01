const Joi = require("joi");

// Password & ObjectID validation.
const { objectId } = require("./custom.validation");

const createAProject = {
  body: Joi.object().keys({
    projectName: Joi.string().required(),
  }),
};

const getAllProjectOfAUser = {
  query: Joi.object().keys({
    pageNumber: Joi.number().optional(),
    dataPerPage: Joi.number().optional(),
  }),
};

const deleteAProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

const updateAProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    modelImagePath: Joi.string().required(),
    productImagePath: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .required(),
  }),
};

const getAProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createAProject,
  getAllProjectOfAUser,
  deleteAProject,
  updateAProject,
  getAProject,
};
