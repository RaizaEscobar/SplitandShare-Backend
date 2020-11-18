var express = require('express');
var router = express.Router();
const User = require('../models/user');

const uploader = require("../configs/cloudinary-setup");


router.post('/improveMyProfile/:id', (req, res, next)=>{
 
  
     User.findByIdAndUpdate(req.params.id, req.body )
       .then(() => {
         res.json({ message: `User is updated successfully.` });
       })
       .catch(err => {
         res.json(err);
       })
   })


   router.post('/uploadPicture/:id',  uploader.single("image"), (req, res, next)=>{
       User.findByIdAndUpdate(req.params.id, {image: req.file.secure_url } )
         .then(() => {
           res.json({ message: `User is updated successfully.` });
         })
         .catch(err => {
           res.json(err);
         })
     }) 
 
   router.get('/profile/:id', (req, res, next)=>{
 
     User.findById(req.params.id)
       .then(response => {
         res.status(200).json(response);
       })
       .catch(err => {
         res.json(err);
       })
   })
   

module.exports = router;
