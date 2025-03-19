const { Sequelize } = require("sequelize");

const config = require("../../../service.config.js");

const db = new Sequelize(
  "service-" + config.route,
  process.env.POSTGRES_USERNAME,
  process.env.POSTGRES_PASSWORD,
  {
    dialect: "postgres",
    logging: false,
  }
);

module.exports = db;
