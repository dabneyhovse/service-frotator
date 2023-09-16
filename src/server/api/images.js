const express = require("express");
const router = express.Router();
const path = require("path");
const { isLoggedIn } = require("./middleware");
module.exports = router;

// serves the frosh images that were scraped from donut
// (or just placed in the images folder)
router.get("/:file", isLoggedIn, function (req, res) {
  // might be security issue here, but best i can tell
  // you cant access any files outside the images dir
  filepath = path.join(__dirname, "../../..", "public/images", req.params.file)
  res.sendFile(filepath)
});
