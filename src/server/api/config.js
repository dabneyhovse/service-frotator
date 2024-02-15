const router = require("express").Router();
const fs = require("fs");
const { isAdmin } = require("module-middleware");
const FILE_NAME = "../../../frotator.config.json";
module.exports = router;

/**
 * Route will be mounted at:
 *
 * PUT dabney.caltech.edu/api/frotator/config
 *
 *
 * req.body.changes:
 *  js object representing changes to properties in the config
 *  file for froshulator, so admins can turn access to it on and
 *  off, etc
 */
router.put("/", isAdmin, (req, res, next) => {
  try {
    const oldSettings = require(FILE_NAME);
    const oldKeys = Object.keys(oldSettings);

    Object.keys(req.body.changes).forEach((key) => {
      if (oldKeys.indexOf(key) == -1) {
        return;
      }
      oldSettings[key] = req.body.changes[key];
    });

    fs.writeFile(FILE_NAME, JSON.stringify(file), function writeJSON(err) {
      if (err) {
        next(err);
      }
      res.sendStatus(201);
    });
  } catch (error) {
    next(error);
  }
});
