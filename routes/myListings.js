const express = require("express");
const router = express.Router();
const Flat = require("../models/Flat");



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
