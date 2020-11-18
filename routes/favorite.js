const express = require("express");
const router = express.Router();
const Flat = require("../models/Flat");
const User = require('../models/user');

router.post("/flat/:id'", (req, res, next) => {
    const favFlatInfo = {
      flatId: req.params.id,
      userId: req.session.currentUser._id,
    };

    User.findOne({$and:[{'userId' : req.session.currentUser._id },{"eventId": req.body.eventId}]}).then(user => {

      if (user !== null) {
  
        Event.findById(req.body.eventId).then(event=>{
          Attendee.find({"eventId":req.body.eventId}).populate('userId').exec((err,attendees)=>{
            const modifiedEvent = {
              "_id" : event._id,
              "title": event.title,
              "date" : dateFormat(event.date,"fullDate" ),
              "type" : event.type,
              "city" : event.city,
              "attendees":attendees,
              "description":event.description,
              "image":event.image,
              "errorMessage" : "already registered!"
            }
            console.log(modifiedEvent)
            res.render('detailEvent', modifiedEvent);
            return ;
          }) 
      
          });
      
      }
      else{
        theAttendance.save((err) => {
          if (err) {
             next(err);
            return;
          }
        res.redirect('/');
       });
      }
    })
    
   
  }); 

module.exports = app;
