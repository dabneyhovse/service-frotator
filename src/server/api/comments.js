const Axios = require("axios").default;
const { Comment } = require("../db/models");
const { claimIncludes } = require("express-openid-connect");
const { keycloakAPI } = require("module-keycloak");

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
router.get("/frosh/:froshId", claimIncludes('backbone_roles', 'frotator-access'), async (req, res, next) => {
  try {
    const comments = Comment.findAll({
      where: { froshId: req.params.froshId },
      include: [{ model: Comment }],
    });
    const keycloakBaseURL = process.env.KC_API_URL;
    const keycloakClientID = process.env.CLIENT_ID;
    // let token = await keycloakAPI.grant({
    //   grant_type: 'client_credentials',
    //   client_id: keycloakClientID,
    // });
    let token = "lol lmao even";
    for (let i = 0; i < comments.length; i++) {
      const res = await keycloakAPI.requestResource(`${keycloakBaseURL}/users/${comments[i].userId}`, token);
      if (res.statusCode === 401) {
        token = await keycloakAPI.grant({
          grant_type: 'client_credentials',
          client_id: keycloakClientID,
        })
        res = await keycloakAPI.requestResource(`${keycloakBaseURL}/users/${comments[i].userId}`, token);
      }
      else if (res.statusCode < 200 || res.statusCode >= 400) {
        throw new Error(`Failed to fetch comment data`);
      }
      const { name , username, picture } = res.data;
      const userData = { name: name, username: username, picture: picture };
      comments[i].dataValues.from = userData;
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
router.get("/:commentId", router, async (req, res, next) => {
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
router.delete("/:commentId", claimIncludes('backbone_roles', 'backbone-admin'), async (req, res, next) => {
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
router.put("/:commentId", claimIncludes('backbone_roles', 'frotator-access'), async (req, res, next) => {
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
router.post("/", claimIncludes('backbone_roles', 'frotator-access'), async (req, res, next) => {
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
        picture: "/resources/images/defaultProfile.png",
        preferred_username: "amogus",
      };
    } else {
      comment.dataValues.from = await req.oidc.user;
    }

    res.json(comment);
  } catch (error) {
    next(error);
  }
});
