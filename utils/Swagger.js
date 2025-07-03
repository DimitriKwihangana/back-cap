const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning PLatform",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "https://course-back-1-frte.onrender.com",
        description: "Hosted",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
