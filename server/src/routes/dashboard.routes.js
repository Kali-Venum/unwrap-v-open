const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const dashboardController = require("../controllers/dashboard.controller");

// Get dashboard data
router.get(
  "/data",
  /*
      #swagger.tags = ['Dashboard']
      #swagger.description = 'Get Dashboard Data'
      #swagger.consumes = ['multipart/form-data']
  
      #swagger.security = [{
          "apiKeyAuth": []
      }]
    */
  auth(),
  dashboardController.getProjectsCount
);

module.exports = router;
