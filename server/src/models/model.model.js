const mongoose = require("mongoose");

// Project Schema
const modelSchema = new mongoose.Schema(
  {
    modelImage: {
      type: String,
    },
    modelGender: {
      type: String,
      enum: ["male", "female"],
    },
    modelRace: {
      type: String,
      enum: ["white", "brown", "dark"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Model", modelSchema);
