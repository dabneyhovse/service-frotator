// const { Comment } = require("../db/models");
// const Concern = require("../db/models/concern");
// const { isAdmin, isLoggedIn } = require("./middleware");

// const router = require("express").Router();
// module.exports = router;

// /**
//  * This will be mounted at the following route:
//  *
//  * GET dabney.caltech.edu/api/frotator/concerns/frosh/:froshId
//  *
//  * returns a json list of the commnents that have been made about a frosh
//  *
//  * req.params.froshId
//  *  the id of the frosh
//  */
// router.get("/frosh/:froshId", isAdmin, async (req, res, next) => {
//   try {
//     const concern = await Concern.findAll({
//       where: { froshId: req.params.froshId },
//     });
//     res.json(concern);
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * This will be mounted at the following route:
//  *
//  * GET dabney.caltech.edu/api/frotator/concerns/frosh
//  *
//  * returns json of the requested concern
//  *
//  * req.params.concernId
//  *  the id of the concern
//  */
// router.get("/:concernId", isAdmin, async (req, res, next) => {
//   try {
//     const concern = await Concern.findByPk(req.params.concernId);
//     res.json(concern);
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * This will be mounted at the following route:
//  *
//  * GET dabney.caltech.edu/api/frotator/comments/frosh
//  *
//  * creates a concern
//  *
//  *
//  * req.body.text
//  * req.body.anon
//  * req.body.froshId
//  * req.user.id
//  */
// router.post("/", isLoggedIn, async (req, res, next) => {
//   try {
//     req.body;

//     const concern = await Concern.create({
//       froshId: req.body.froshId,
//       text: req.body.text,
//       anon: req.body.anon,
//       userId: req.user.id,
//     });

//     res.sendStatus(201);
//   } catch (error) {
//     next(error);
//   }
// });
