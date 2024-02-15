const router = require("express").Router();

router.use("/frosh", require("./frosh.js"));
router.use("/comments", require("./comments.js"));
router.use("/images", require("./images.js"));
// router.use("/events", require("./events.js"));
// router.use("/config", require("./config.js"));

module.exports = router;
