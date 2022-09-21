const Comment = require("./comment");
const Concern = require("./concern");
const Event = require("./event");
const Frosh = require("./frosh");
const Prediction = require("./prediction");
const Vote = require("./vote");

/**
 * Comments are made on frosh profiles
 */
Frosh.hasMany(Comment, {
  foreignKey: "froshId",
});
Comment.belongsTo(Frosh);

/**
 * Users make the comments, but we dont have direct access to users,
 * so they the comment model has a userId field in it.
 */
// it would be the following
// User.hasMany(Comment);
// Comment.belongsTo(User);

/**
 * Users predict where frosh will go
 */
Frosh.hasMany(Prediction);
Prediction.belongsTo(Frosh);

/**
 * Frosh go to events
 */
Event.belongsToMany(Frosh, { through: "frotator-frosh-events" });
Frosh.belongsToMany(Event, { through: "frotator-frosh-events" });

Frosh.hasMany(Vote);
Vote.belongsTo(Frosh);

Frosh.hasMany(Concern);
Concern.belongsTo(Frosh);
/**
 * Comments can have replies
 */
Comment.hasMany(Comment);
Comment.belongsTo(Comment, {
  foreignKey: "replyToId",
});

module.exports = { Comment, Event, Frosh, Prediction };
