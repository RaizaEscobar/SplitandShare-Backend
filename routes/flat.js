const express = require("express");
const router = express.Router();
const Flat = require("../models/Flat");
const User = require("../models/user");

const uploader = require("../configs/cloudinary-setup");

router.post("/flat/:id", async (req, res, next) => {
  let currentUser = await User.findById(req.session.currentUser);
  let favorites = currentUser.favoriteFlats;
  let index = favorites.indexOf(req.params.id);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(req.params.id);
  }

  User.findByIdAndUpdate(req.session.currentUser, { favoriteFlats: favorites })
    .then(() => {
      res.json({ message: `Flat is updated successfully.` });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/myListings/edit/:id", (req, res, next) => {
  Flat.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: `Flat is updated successfully.` });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/flat/:id", (req, res, next) => {
  Flat.findById(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/flats", (req, res, next) => {
  let {
    minPrice,
    maxPrice,
    rooms,
    restrooms,
    neighborhood,
    airconditioner,
    elevator,
    balcony,
    squareMeters,
    furnished,
  } = req.query;

  let condition = { $and: [] };
  neighborhood && condition.$and.push({ neighborhood: neighborhood });
  airconditioner && condition.$and.push({ airconditioner: airconditioner });
  elevator && condition.$and.push({ elevator: elevator });
  balcony && condition.$and.push({ balcony: balcony });
  furnished && condition.$and.push({ furnished: furnished });
  rooms && condition.$and.push({ rooms: { $gte: rooms } });
  restrooms && condition.$and.push({ restrooms: { $gte: restrooms } });
  squareMeters && condition.$and.push({ squareMeters: { $gte: squareMeters } });
  maxPrice && condition.$and.push({ price: { $lte: maxPrice } });
  minPrice && condition.$and.push({ price: { $gte: minPrice } });

  if (condition.$and.length === 0) {
    condition = {};
  }

  Flat.find(condition)
    .then((flatsList) => {
      res.json(flatsList);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/addMyFlat", (req, res, next) => {
  Flat.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    contact: req.body.contact,
    rooms: req.body.rooms,
    restrooms: req.body.restrooms,
    neighborhood: req.body.neighborhood,
    airconditioner: req.body.airconditioner,
    elevator: req.body.elevator,
    balcony: req.body.balcony,
    parking: req.body.parking,
    address: req.body.address,
    centralHeating: req.body.centralHeating,
    squareMeters: req.body.squareMeters,
    furnished: req.body.furnished,
    terrace: req.body.terrace,
    swimmingPool: req.body.swimmingPool,
    storeRoom: req.body.storeRoom,
    builtinWardrobes: req.body.builtinWardrobes,
    flatOwner: req.session.currentUser._id,
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post(
  "/uploadFlatPicture/:id",
  uploader.array("flatImages"),
  async (req, res, next) => {
    let currentFlat = await Flat.findById(req.params.id);
    let flatImg = req.files.map((element) => {
      return element.secure_url;
    });

    let imageCollection = currentFlat.flatImages;
    imageCollection.push(...flatImg);
    Flat.findByIdAndUpdate(req.params.id, { flatImages: imageCollection })
      .then(() => {
        res.json({
          message: `Flat photos have been updated successfully
          .`,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

router.get("/myListings", (req, res, next) => {
  Flat.find({ flatOwner: req.session.currentUser._id })
    .then((allTheFlats) => {
      res.json(allTheFlats);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
