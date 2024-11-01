const Joi = require("joi");

const createAStripeSubscriptionPlan = {
  body: Joi.object().keys({
    planName: Joi.string().required(),
    currency: Joi.string().valid("usd").required(),
    price: Joi.number().required(),
  }),
};

module.exports = {
  createAStripeSubscriptionPlan,
};
