const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Viton API",
    description: "API listing of viton.",
  },
  host: "localhost:3050",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header", // can be "header", "query" or "cookie"
      name: "Authorization", // name of the header, query parameter or cookie
      description: "Bearer authentication token"
    },
  },
};

const outputFile = "../../swagger-output.json";
const endpointsFiles = ["../index.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

// swaggerAutogen(outputFile, routes, doc);

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("../index"); // Your project's root file
});
