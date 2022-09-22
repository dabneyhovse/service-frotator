const { Op, Sequelize } = require("sequelize");
const { Frosh, Comment } = require("../db/models");
const { isLoggedIn, isAdmin, upload } = require("./middleware");
const { parse } = require("csv-parse");
const fs = require("fs");
const { Duplex } = require("stream"); // Native Node Module
const Axios = require("axios");
const Vote = require("../db/models/vote");

const router = require("express").Router();

module.exports = router;

/**
 * converts buffer oobject into readable stream
 * @param {buffer object} myBuffer
 * @returns stream
 */
function bufferToStream(myBuffer) {
  let tmp = new Duplex();
  tmp.push(myBuffer);
  tmp.push(null);
  return tmp;
}

function googleDriveImageToSRC(imageURL) {
  if (!imageURL) {
    return undefined;
  }
  const splitURL = imageURL.split("/");
  let didx = splitURL.indexOf("d");
  let imageId = "";
  if (didx !== -1) {
    imageId = splitURL[didx + 1];
  } else {
    // "https://drive.google.com/open?id=14V3WoBpWm3qnxnMfT_beVMTrHEKVxX04"
    imageId = imageURL.split("open?id=")[1];
  }

  return `https://drive.google.com/uc?export=view&id=${imageId}`;
}

const USERS_PER_PAGE = 20;
const paginate = (page) => {
  const offset = (page - 1) * USERS_PER_PAGE;
  const limit = USERS_PER_PAGE;

  return {
    offset,
    limit,
  };
};

/**
 * This will be mounted at the following route:
 *
 * GET dabney.caltech.edu/api/frotator/frosh
 *
 * returns a json list of the recorded frosh
 * that match the search conditions.
 *
 * req.query:
 *    search:
 *        name:     substring of the frosh's name
 *        event:    event the frosh is attending (event id from the events model)
 */
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const search = req.query.search ? JSON.parse(req.query.search) : {};
    /**
     * include and where params to be added
     * to the query
     */
    let include = [];
    let where = {};

    if (search.name) {
      where = {
        ...where,
        [Op.or]: [
          {
            firstName: {
              [Op.iLike]: "%" + search.name + "%",
            },
          },
          {
            preferredName: {
              [Op.iLike]: "%" + search.name + "%",
            },
          },
          {
            lastName: {
              [Op.iLike]: "%" + search.name + "%",
            },
          },
        ],
      };
    }

    if (search.dinnerGroup) {
      if (search.dinnerGroup !== "any") {
        where = { ...where, dinnerGroup: search.dinnerGroup };
      }
    }

    if (search.event) {
      include = [...include, { model: "" }];
    }
    const query = {
      where,
      include,
      ...(req.query.cards || search.dinnerGroup !== "any"
        ? {}
        : paginate(req.query.pageNum || 1)),
      attributes: [
        "pronouns",
        "image",
        "firstName",
        "lastName",
        "preferredName",
        "bio",
        "id",
        "dinnerGroup",
        "anagram",
      ],
    };

    query.order = [["id", "ASC"]];
    const frosh = await Frosh.findAndCountAll(query);

    frosh.count = Math.ceil(frosh.count / USERS_PER_PAGE);
    frosh.rows.forEach((f) => {
      // Tack on the display name
      f.dataValues.displayName = f.safeName();
    });
    res.status(200).json(frosh);
  } catch (error) {
    next(error);
  }
});

/**
 * This will be mounted at the following route:
 *
 * GET dabney.caltech.edu/api/frotator/frosh/:froshId
 *
 * returns a json list of the recorded frosh
 * that match the search conditions.
 *
 * req.params:
 *    froshId: id of the frosh to be requested
 *
 */
router.get("/:froshId", isLoggedIn, async (req, res, next) => {
  try {
    const frosh = await Frosh.findByPk(req.params.froshId, {
      attributes: [
        "firstName",
        "lastName",
        "preferredName",
        "pronouns",
        "image",
        "bio",
        "id",
        "dinnerGroup",
        "anagram",
      ],
      include: [{ model: Comment, where: { private: false }, required: false }],
    });
    if (!frosh) {
      res.sendStatus(404);
      return;
    }
    frosh.dataValues.displayName = frosh.safeName();

    for (let i = 0; i < frosh["frotator-comments"].length; i++) {
      let from;
      if (frosh["frotator-comments"][i].anon) {
        from = {
          profile: { photo: "/resources/images/defaultProfile.png" },
          username: "amogus",
        };
      } else {
        const res = await Axios.get(
          `http://localhost:8080/api/users/${frosh["frotator-comments"][i].userId}`,
          { params: { local: process.env.LOCAL } }
        );
        from = res.data;
      }
      frosh["frotator-comments"][i].dataValues.from = from;
    }
    const vote = await Vote.findOne({
      where: { userId: req.user.id, frotatorFroshId: req.params.froshId },
    });
    if (vote) {
      frosh.dataValues.favorite = true;
    }

    res.status(200).json(frosh);
  } catch (error) {
    next(error);
  }
});

/**
 * This will be mounted at the following route:
 *
 * GET dabney.caltech.edu/api/frotator/frosh/:froshId
 *
 * returns a json list of the ranked frosh
 *
 */
router.get("/ranking", isAdmin, async (req, res, next) => {
  try {
    const frosh = await Frosh.findAll({
      where: {
        [Op.not]: { rank: null },
      },
      order: [["rank", "ASC"]],
    });
    res.json(frosh);
  } catch (error) {
    next(error);
  }
});

/**
 * This will be mounted at the following route:
 *
 * POST dabney.caltech.edu/api/frotator/frosh
 *
 * req.body.type:
 *    type of the data upload
 *      0 : csv, a csv file on the frosh with the flowing cols:
 *          fullName, lastName, preferredName, photo
 *
 *      1 : zip, a zip file of the pdf profiles excomm gets from admin
 *
 * req.body.froshData:
 *    the data file described by the type above
 *
 * returns status 201 on success
 */
router.post("/", isLoggedIn, upload.single("data"), async (req, res, next) => {
  try {
    fs.createReadStream(req.file.path)
      .pipe(parse({ delimiter: "," }))
      .on("data", function (csvrow) {
        csvData.push(csvrow);
      })
      .on("end", function () {
        res.sendStatus(201);
      });
  } catch (error) {
    next(error);
  }
});

router.post("/favorite", async (req, res, next) => {
  try {
    if (req.body.favorite) {
      await Vote.findOrCreate({
        where: {
          userId: req.user.id,
          frotatorFroshId: req.body.froshId,
          approve: true,
        },
      });
    } else {
      const vote = await Vote.findOne({
        where: { userId: req.user.id, frotatorFroshId: req.body.froshId },
      });
      await vote.destroy();
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.put("/", isAdmin, upload.single("csv-file"), async (req, res, next) => {
  try {
    const myReadableStream = bufferToStream(req.file.buffer);
    const updateable = [
      "preferredName",
      "pronouns",
      "year",
      "email",
      "groupName",
      "anagram",
      "image",
      "rank",
      "bioPDF",
      "bio",
      "dinnerGroup",
    ];

    csvData = [];
    myReadableStream
      .pipe(parse({ delimiter: ",", columns: true }))
      .on("data", function (csvrow) {
        csvData.push(csvrow);
      })
      .on("end", async () => {
        for (let i = 1; i < csvData.length; i++) {
          const curr = csvData[i];

          let frosh;
          if (curr.froshId) {
            frosh = await Frosh.findByPk(curr.froshId);
          }
          if (!frosh) {
            frosh = await Frosh.findOne({
              where: {
                email: {
                  [Sequelize.Op.iLike]: curr.email,
                },
              },
            });
          }
          if (!frosh) {
            let orWhere = [
              {
                firstName: {
                  [Sequelize.Op.iLike]: curr.firstName,
                },
              },
              {
                preferredName: {
                  [Sequelize.Op.iLike]: curr.firstName,
                },
              },
            ];
            frosh = await Frosh.findOne({
              where: {
                [Sequelize.Op.or]: orWhere,
                lastName: {
                  [Sequelize.Op.iLike]: curr.lastName,
                },
              },
            });
          }

          if (frosh) {
            let bio = {
              ...frosh.bio,
            };

            let toUpdate = {};

            currKeys = Object.keys(curr).forEach((key) => {
              if (key.indexOf("bio-") == 0) {
                bio[key.replace("bio-", "")] = curr[key];
              }
              if (updateable.indexOf(key) !== -1) {
                toUpdate[key] = curr[key];
              }
            });

            toUpdate = { ...toUpdate, bio };
            if (toUpdate.image) {
              toUpdate.image = googleDriveImageToSRC(toUpdate.image);
            }

            frosh.set(toUpdate);

            await frosh.save();
          } else {
            console.log("\t Could not find frosh:", curr);
          }
        }
        res.sendStatus(201);
        return;
      });
  } catch (error) {
    next(error);
  }
});
