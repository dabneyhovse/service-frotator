const { Axios } = require("axios");
const { Comment } = require("../db/models");
const { isAdmin, isLoggedIn } = require("module-middleware");

const router = require("express").Router();
module.exports = router;

/**
 * This will be mounted at the following route:
 *
 * GET dabney.caltech.edu/api/frotator/comments/frosh
 *
 * returns a json list of the commnents that have been made about a frosh
 *
 * req.params.froshId
 *  the id of the frosh
 */
router.get("/frosh/:froshId", isLoggedIn, async (req, res, next) => {
  try {
    const comments = Comment.findAll({
      where: { froshId: req.params.froshId },
      include: [{ model: Comment }],
    });
    for (let i = 0; i < comments.length; i++) {
      const res = await Axios.get(`/api/users/${comments[i].userId}`);
      comments[i].dataValues.from = res.data;
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This will be mounted at the following route:
 *
 * GET dabney.caltech.edu/api/frotator/comments/frosh
 *
 * returns json of the requested comment
 *
 * req.params.froshId
 *  the id of the comment
 */
router.get("/:commentId", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    res.json(comment);
  } catch (error) {
    next(error);
  }
});

/**
 * This will be mounted at the following route:
 *
 * GET dabney.caltech.edu/api/frotator/comments/frosh
 *
 * deletes a comment
 *
 * req.params.froshId
 *  the id of the comment
 */
router.delete("/:commentId", isAdmin, async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    await comment.destroy();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

/**
 * This will be mounted at the following route:
 *
 * GET dabney.caltech.edu/api/frotator/comments/frosh
 *
 * edits the comment at commentId
 *
 * req.params.commentId
 *  the id of the comment
 */

const EDITABLE_FIELDS = [""];
router.put("/:commentId", async (req, res, next) => {
  try {
    const changes = req.body.changes;
    const comment = await Comment.findByPk(req.params.commentId);
    const updates = {};
    Object.keys(req.body.changes).forEach((key) => {
      if (EDITABLE_FIELDS.indexOf(key) !== -1) {
        updates[key] = changes[key];
      }
    });

    await comment.update(updates);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

/**
 * This will be mounted at the following route:
 *
 * GET dabney.caltech.edu/api/frotator/comments/frosh
 *
 * edits the comment at commentId
 *
 * req.params.commentId
 *  the id of the comment
 */
router.post("/", async (req, res, next) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      anon: req.body.anon,
      froshId: req.body.froshId,
      userId: req.body.userId,
      private: false,
    });
    if (comment.anon) {
      comment.dataValues.from = {
        profile: { photo: "/resources/images/defaultProfile.png" },
        username: "amogus",
      };
    } else {
      comment.dataValues.from = req.user;
    }

    res.json(comment);
  } catch (error) {
    next(error);
  }
});
