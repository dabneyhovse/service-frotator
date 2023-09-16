const router = require("express").Router();

// TODO use your own api routes
// router.use("/events", require("./events.js"));
router.use("/frosh", require("./frosh.js"));
router.use("/comments", require("./comments.js"));
router.use("/images", require("./images.js"));
// router.use("/config", require("./config.js"));

module.exports = router;
