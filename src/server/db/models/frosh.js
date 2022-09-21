const Sequelize = require("sequelize");
const db = require("../db");

const Frosh = db.define("frotator-frosh", {
  /**
   * String that represents the first name of the frosh
   */
  firstName: {
    type: Sequelize.STRING,
    defaultValue: "",
    allowNull: false,
  },

  /**
   * String that represents the last name of the frosh
   */
  lastName: {
    type: Sequelize.STRING,
    defaultValue: "",
    allowNull: false,
  },

  /**
   * String that represents a frosh's preferred name
   */
  preferredName: {
    type: Sequelize.STRING,
    defaultValue: "",
    allowNull: true,
  },

  /**
   * the prefered pronoun(s) of the prefrosh
   */
  pronouns: {
    type: Sequelize.STRING,
    defaultValue: "",
    allowNull: true,
  },

  /**
   * The year the frosh is
   * (transfer and others wil be different)
   */
  year: {
    type: Sequelize.STRING,
    defaultValue: "First Year",
  },

  /**
   * email
   */
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  /**
   * fcc group name
   */
  groupName: {
    type: Sequelize.STRING,
    defaultValue: "",
  },

  /**
   * frosh anagram
   */
  anagram: {
    type: Sequelize.STRING,
    defaultValue: null,
    allowNull: true,
  },

  /**
   * Path to an image of the frosh
   */
  image: {
    type: Sequelize.STRING,
    defaultValue: null,
  },

  /**
   * The ranking of the frosh, is altered during big bad by the secretary
   * the secretary
   */
  rank: {
    type: Sequelize.INTEGER,
    defaultValue: -1,
  },

  /**
   * Path to the pdf file provided by admin
   *  (if they ever do provide it)
   *
   */
  bioPDF: {
    type: Sequelize.STRING,
    defaultValue: "",
  },

  /**
   *
   */
  bio: {
    type: Sequelize.JSON,
    defaultValue: {
      hometown: "",
      major: "",
      hobbies: "",
      clubs: "",
      funfact: "",
    },
  },
  dinnerGroup: {
    type: Sequelize.STRING,
  },
});

Frosh.prototype.safeName = function () {
  return `${this.preferredName ? this.preferredName : this.firstName} ${
    this.lastName
  }`;
};

module.exports = Frosh;
