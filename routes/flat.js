const express = require("express");
const router = express.Router();
const Flat = require("../models/Flat")

router.post('/myListings/edit/:id', (req, res, next)=>{
    Flat.findByIdAndUpdate(req.params.id, req.body)
      .then(() => {
        res.json({ message: `Flat is updated successfully.` });
      })
      .catch(err => {
        res.json(err);
      })
  })

  router.get('/flat/:id', (req, res, next)=>{

    Flat.findById(req.params.id)
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => {
        res.json(err);
      })
  })

  router.post("/addMyFlat", (req, res, next) => {
    Flat.create({
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      price: req.body.price,
      contact: req.body.contact,
      rooms: req.body.rooms,
      restrooms: req.body.restrooms,
      neighborhood: req.body.neighborhood,
      aircondition: req.body.aircondition,
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
      flatOwner: req.session.currentUser._id
    })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get('/myListings', (req, res, next) => {
    Flat.find({"flatOwner":req.session.currentUser._id})
    .then(allTheFlats => {
        res.json(allTheFlats);
      })
      .catch(err => {
        res.json(err);
      })
  });

module.exports = router;