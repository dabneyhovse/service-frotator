const Sequelize = require("sequelize");
const db = require("../db");

const Prediction = db.define("frotator-prediction", {
  /**
   * which house the user predicted
   */
  userId: {
    /**
     * the id of the user who made the prediction
     */
    type: Sequelize.INTEGER,
  },

  /**
   * Which house the user predicts the frosh to go into
   */
  house: Sequelize.ENUM([
    "dabney",
    "blacker",
    "ricketts",
    "fleming",
    "page",
    "avery",
    "venerable",
    "lloyd",
  ]),

  /**
   * the amount of Dbux that was bet on this outcome
   */
  bet: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Prediction;
