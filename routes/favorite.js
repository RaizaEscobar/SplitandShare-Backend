const express = require("express");
const router = express.Router();
const Flat = require("../models/Flat");
const User = require('../models/user');

/* router.post("/flat/:id'", (req, res, next) => {
    console.log("holiii")
   User.findByIdAndUpdate(req.session.currentUser, {"favoriteFlats" : req.params.id})
   .then(() => {
    res.json({ message: `Flat is updated successfully.` });
  })
  .catch(err => {
    res.json(err);
  })
    
  });  */

module.exports = router;
