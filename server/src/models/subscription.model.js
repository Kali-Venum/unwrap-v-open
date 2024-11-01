const mongoose = require("mongoose");

// Subscription Schema.
const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    userEmail: {
      type: String,
    },
    subscriptionId: {
      type: String,
    },
    priceId: {
      type: String,
    },
    endDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("subscription", subscriptionSchema);
