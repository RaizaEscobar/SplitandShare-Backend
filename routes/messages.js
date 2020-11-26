const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.post("/message/send", (req, res, next)=>{
    const toSave = {
        text: req.body.text,
        from: req.session.currentUser._id,
        to: req.body.receiver
    }
    Message.create(toSave).then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.json(err);
      });
})

router.get("/messages/:id", (req,res,next) => {
    Message.find({$or:[{$and:[{from:req.session.currentUser._id},
                                {to:req.params.id}]},
                        {$and:[{from:req.params.id},
                                {to:req.session.currentUser._id}]}]})
    .then(response=>{
        res.json(response)
    })
    .catch((err) => {
        res.json(err);
      });
})

router.get("/myMessages", (req,res,next)=>{
    Message.find({$or:[{from:req.session.currentUser._id},{to:req.session.currentUser._id}]})
    .populate("from")
    .populate("to")
    .exec((err,response)=>{
        let result = []
        response.forEach(element=>{         
            if(element.from._id != req.session.currentUser._id && !alreadyExists(result, element.from))
            {
                result.push(element.from);
            }
            if(element.to._id != req.session.currentUser._id && !alreadyExists(result, element.to))
            {
                result.push(element.to);
            }
        })
        res.json(result)
    })
})

function alreadyExists(list, user){
    let exists = false;
    for(let i=0; i<list.length; i++){
        if(list[i].email == user.email)
        {            
            return true;
        }
    }        
    return exists;
}

module.exports = router;
