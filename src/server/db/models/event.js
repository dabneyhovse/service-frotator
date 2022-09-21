const Sequelize = require("sequelize");
const db = require("../db");

const Event = db.define("frotator-event", {
  /**
   * type of the event singular
   */
  eventType: {
    type: Sequelize.ENUM(["Dinner", "Dessert", "Linner", "Pod", "N/A"]),
    defaultValue: "N/A",
    allowNull: false,
  },

  /**
   * Event number
   *
   * The number of what type it is
   * Dinner 1, Dinnner 2, Linner 1 etc
   */
  eventNumber: {
    type: Sequelize.INTEGER,
  },

  /**
   * When the event is
   */
  date: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

module.exports = Event;
