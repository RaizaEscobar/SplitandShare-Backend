const express = require('express');
const router  = express.Router();
const User = require('../models/user');

router.post('/improveMyProfile/:id', (req, res, next)=>{
    User.findByIdAndUpdate(req.params.id, req.body)
      .then(() => {
        res.json({ message: `User is updated successfully.` });
      })
      .catch(err => {
        res.json(err);
      })
  })

  router.get('/improveMyProfile/:id', (req, res, next)=>{

    User.findById(req.params.id)
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => {
        res.json(err);
      })
  })
  

module.exports = router;

