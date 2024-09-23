const Sequelize = require("sequelize");
const db = require("../db");

const Comment = db.define("frotator-comment", {
  /**
   * userId of the user from the backbone database
   */
  userId: {
    type: Sequelize.STRING,
  },

  /**
   * Comment text
   */
  text: {
    type: Sequelize.TEXT,
    defaultValue: "",
    allowNull: false,
  },

  /**
   * If private is true it will only be shown to admins,
   * otherwise it's a normal comment
   */
  private: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },

  anon: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Comment;
