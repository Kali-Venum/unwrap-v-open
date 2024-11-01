const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

// Controller imports.
const stripeController = require("../controllers/stripe.controller");

// Validation imports.
const stripeValidation = require("../validations/stripe.validation");

// Create a new subscription plan.
router.post(
  "/create/subscription/plan",
  /*
      #swagger.tags = ['Stripe']
      #swagger.description = 'Create a project API'
    
      #swagger.parameters['Body'] = {
          in: 'body',
          description: 'Create a project API.',
          required: true,
          schema: {
            planName: "Your plan name",
            currency: "Your currency",
            price: 0
          }
      }
  
      #swagger.security = [{
          "apiKeyAuth": []
      }]
    */
  //   auth(),
  validate(stripeValidation.createAStripeSubscriptionPlan),
  stripeController.createAStripeSubscriptionPlan
);

// Fetch all subscription plans.
router.get(
  "/get/subscription/plans",
  /*
      #swagger.tags = ['Stripe']
      #swagger.description = 'Fetch all subscription plans API'
  
      #swagger.security = [{
          "apiKeyAuth": []
      }]
    */
  //   auth(),
  stripeController.fetchAllStripeSubscriptionPlans
);

//Subscribe a plan
router.post(
  "/subscribe/plan",
  /*
      #swagger.tags = ['Stripe']
      #swagger.description = 'Subscribe a plan'
  
      #swagger.security = [{
          "apiKeyAuth": []
      }]
    */
  //   auth(),
  stripeController.subscripeAStripePlan
);

// Subscribe a plan using session checkout.
router.post(
  "/subscribe/plan/session-checkout",
  /*
      #swagger.tags = ['Stripe']
      #swagger.description = 'Subscribe a plan using session checkout.'

      #swagger.parameters['Body'] = {
          in: 'body',
          description: 'subscribe a plan using stripe session checkout.',
          required: true,
          schema: {
            priceId: "Your price id.",
          }
      }
  
      #swagger.security = [{
          "apiKeyAuth": []
      }]
    */
  auth(),
  stripeController.stripeSubscriptionSessionCheckout
);
router.post(
  "/webhook",
  /*
      #swagger.tags = ['Stripe']
      #swagger.description = 'Register the webhook.'

      #swagger.parameters['Body'] = {
          in: 'body',
          description: 'Register a webhook in the stripe',
          required: true,
          schema: {
            event: "Success or updated",
          }
      }
  
      #swagger.security = [{
          "apiKeyAuth": []
      }]
    */
  // auth(),
  stripeController.stripeWebhook
);

module.exports = router;
