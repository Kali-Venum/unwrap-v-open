const catchAsync = require("../utils/catchAsync");
const messages = require("../messages.json");

// Sercice imports.
const modelService = require("../services/model.service");

// Create a project controller.
const getModels = catchAsync(async (req, res) => {
  const models = await modelService.getModels(req.body);

  if (models) {
    return res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.MODELS_FOUND,
      },
      result: {
        data: models,
      },
    });
  }
});

module.exports = {
  getModels,
};
