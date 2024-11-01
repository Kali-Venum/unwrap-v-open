const config = require("../configs/index");

// Initilizing stripe.
const stripe = require("stripe")(config.stripe.secret_key);

// Create a customer using stripe.
const createACustomerByStripe = async ({ email, stripeToken }) => {
  // If the customer does not exist or does not have an active subscription, proceed to create a new customer
  const customer = await stripe.customers.create({
    email,
    payment_method: stripeToken,
    invoice_settings: {
      default_payment_method: stripeToken,
    },
  });
  return customer;
};

// Create a product using stripe.
const createAProductByStripe = async ({ planName }) => {
  const product = await stripe.products.create({
    name: planName,
  });

  return product;
};

// Craete a price using stripe.
const assignAPriceToAStripeProduct = async ({ currency, price, planName }) => {
  const priceDetails = await stripe.prices.create({
    currency: currency,
    unit_amount: price * 100,
    recurring: {
      interval: "month",
    },
    product_data: {
      name: planName,
    },
  });

  return priceDetails;
};

// Fetch subscription plans from Stripe
const fetchAllStripeSubscriptionPlans = async () => {
  // Fetch all subscription plans from stripe.
  const plans = await stripe.plans.list();

  // Retrieve product information for each price
  const products = await Promise.all(
    plans.data.map(async (item) => {
      const product = await stripe.products.retrieve(item.product);
      return { price: item, product };
    })
  );

  return products;
};

// subscribe a stripe plan.
const subscripeAStripePlan = async ({ email, stripeToken, planID }) => {
  try {
    const customer = await createACustomerByStripe({ email, stripeToken });
    
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: planID }],
      expand: ["latest_invoice.payment_intent"],
    });
    return subscription;
  } catch (error) {
    console.log(error);
  }
};

// stripe subscription using session-checkout.
const stripeSubscriptionSessionCheckout = async ({
  email,
  userId,
  priceId,
}) => {
  // Try to retrieve an existing customer by email
  const existingCustomers = await stripe.customers.list({
    email: email,
    limit: 1,
  });

  let customer;
  if (existingCustomers.data.length > 0) {
    // Customer already exists
    customer = existingCustomers.data[0];

    // Check if the customer already has an active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      // Customer already has an active subscription, send them to biiling portal to manage subscription

      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${config.host}:${config.port}/`,
      });
      return stripeSession;
    }
  } else {
    // No customer found, create a new one
    customer = await stripe.customers.create({
      email: email,
      metadata: {
        userId, // Replace with actual Auth0 user ID
      },
    });
  }

  // Now create the Stripe checkout session with the customer ID
  const session = await stripe.checkout.sessions.create({
    success_url: `${config.host}:${config.port}/stripe/subscription/success`,
    cancel_url: `${config.host}:${config.port}/stripe/subscription/cancel`,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    // customer_email: email,
    customer: customer.id, // Use the customer ID here
  });

  return session;
};

module.exports = {
  createACustomerByStripe,
  createAProductByStripe,
  assignAPriceToAStripeProduct,
  fetchAllStripeSubscriptionPlans,
  subscripeAStripePlan,
  stripeSubscriptionSessionCheckout,
};
