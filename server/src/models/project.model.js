const mongoose = require("mongoose");

// Project Schema
const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    projectName: {
      type: String,
      required: true,
    },
    modelImage: {
      type: String,
    },
    productImages: [String],
    finalImages: [String],
    userAddedImages: {
      type: Boolean,
      default: false,
    },
    aiGeneratedImages: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
