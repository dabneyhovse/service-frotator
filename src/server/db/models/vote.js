const Sequelize = require("sequelize");
const db = require("../db");

const Vote = db.define("frotator-vote", {
  /**
   * userId of the user from the backbone database
   */
  userId: {
    type: Sequelize.INTEGER,
  },

  approve: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Vote;
