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

  router.get('/myListings/edit/:id', (req, res, next)=>{

    Flat.findById(req.params.id)
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => {
        res.json(err);
      })
  })

module.exports = router;