const Sequelize = require("sequelize");
const db = require("../db");

const Concern = db.define("frotator-concern", {
  /**
   * userId of the user from the backbone database
   */
  userId: {
    type: Sequelize.STRING,
  },

  anon: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },

  text: {
    type: Sequelize.TEXT,
    defaultValue: "",
    allowNull: false,
  },
});

module.exports = Concern;
