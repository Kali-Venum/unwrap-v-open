const express = require("express");
const router = express.Router();

// Route files.
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const projectRoutes = require("./project.routes");
const imageRoutes = require("./image.routes");
const modelRoutes = require("./model.routes");
const dashboardRoutes = require("./dashboard.routes");
const stripeRoutes = require("./stripe.routes");

/* ------------------------------------------------------ Routes ----------------------------------------------------- */

// Auth Routes.
router.use("/auth", authRoutes);

// User Routes.
router.use("/users", userRoutes);

// Project Routes.
router.use("/project", projectRoutes);

// Image Routes.
router.use("/image", imageRoutes);

// Model Routes.
router.use("/model", modelRoutes);

// Dashboard Routes.
router.use("/dashboard", dashboardRoutes);

// Stripe Routes.
router.use("/stripe", stripeRoutes);

module.exports = router;
