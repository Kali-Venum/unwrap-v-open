const catchAsync = require("../utils/catchAsync");
const messages = require("../messages.json");

// imports.
const stripeService = require("../services/stripe.service");
const SubscriptionModel = require("../models/subscription.model");

// Create a stripe subscription plan controller.
const createAStripeSubscriptionPlan = catchAsync(async (req, res) => {
  const { planName, currency, price } = req.body;

  // Create a product.
  const product = await stripeService.createAProductByStripe({ planName });

  //   Craete a price for the product.
  const priceDetails = await stripeService.assignAPriceToAStripeProduct({
    currency,
    price,
    planName: product.name,
  });

  if (product) {
    return res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.PLAN_CREATED,
      },
      result: {
        data: priceDetails,
      },
    });
  }
});

// Fetch all subscription plans controller.
const fetchAllStripeSubscriptionPlans = catchAsync(async (req, res) => {
  const plans = await stripeService.fetchAllStripeSubscriptionPlans();

  return res.status(200).send({
    serverResponse: {
      code: 200,
      message: messages.PLANS_FETCHED,
    },
    result: {
      data: plans,
    },
  });
});

// Subscribe a plan
const subscripeAStripePlan = catchAsync(async (req, res) => {
  const { email, stripeToken, planID } = req.body;

  const subscription = await stripeService.subscripeAStripePlan({
    email,
    stripeToken,
    planID,
  });
  return res.status(200).send({
    serverResponse: {
      code: 200,
      message: messages.SUCCESS,
    },
    result: {
      data: subscription,
    },
  });
});

// Subscribe a stripe plan using session checkout.
const stripeSubscriptionSessionCheckout = catchAsync(async (req, res) => {
  const { priceId } = req.body;
  const { _id, email } = req.user;

  const session = await stripeService.stripeSubscriptionSessionCheckout({
    email,
    userId: _id.toString(),
    priceId,
  });
  return res.status(200).send({
    serverResponse: {
      code: 200,
      message: messages.SUCCESS,
    },
    result: {
      data: session,
    },
  });
});

const stripeWebhook = catchAsync(async (req, res) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    // On payment successful, get subscription and customer details
    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription
    );
    const customer = await stripe.customers.retrieve(
      event.data.object.customer
    );
    if (invoice.billing_reason === "subscription_create") {
      // Handle the first successful payment
      // DB code to update the database for first subscription payment
      const result = await SubscriptionModel.create({
        userId: customer?.metadata?.userId,
        userEmail: customer.email, // Add user's email
        subscriptionId: event.data.object.subscription,
        priceId: subscription.items.data[0].price.id,
        endDate: subscription.current_period_end * 1000,
      });
      
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      console.log(
        `First subscription payment successful for Invoice ID: ${customer.email} ${customer?.metadata?.userId}`
      );
    } else if (
      invoice.billing_reason === "subscription_cycle" ||
      invoice.billing_reason === "subscription_update"
    ) {
      // Handle recurring subscription payments
      // DB code to update the database for recurring subscription payments
      // Define the filter to find the document with the specified userId
      const filter = { userId: customer?.metadata?.userId };
      const updateDoc = {
        $set: {
          endDate: subscription.current_period_end * 1000,
          priceId: subscription.items.data[0].price.id,
        },
      };
      // Update the document
      const result = await SubscriptionModel.updateOne(filter, updateDoc);
      if (result.matchedCount === 0) {
        console.log("No documents matched the query. Document not updated");
      } else if (result.modifiedCount === 0) {
        console.log(
          "Document matched but not updated (it may have the same data)"
        );
      } else {
        console.log("Successfully updated the document");
      }
      console.log(
        `Recurring subscription payment successful for Invoice ID: ${invoice.id}`
      );
    }
    // For canceled/renewed subscription
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      if (subscription.cancel_at_period_end) {
        // DB code to update the customer's subscription status in your database
      } else {
        console.log(`Subscription ${subscription.id} was restarted.`);
        // get subscription details and update the DB
      }
    }
    res.status(200).end();
  }
});

module.exports = {
  createAStripeSubscriptionPlan,
  fetchAllStripeSubscriptionPlans,
  subscripeAStripePlan,
  stripeSubscriptionSessionCheckout,
  stripeWebhook,
};
