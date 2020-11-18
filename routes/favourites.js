const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/users", (req, res, next) => {
  let {location, gender, maxAge, minAge, hasPet, 
    isSmoking, isWorking, isStudyng, maxBudget} = req.query

  let condition={$and:[]}
  location && condition.$and.push({"location": location})
  gender && condition.$and.push({"gender":gender})
  hasPet && condition.$and.push({"hasPet":hasPet})
  isSmoking && condition.$and.push({"isSmoking":isSmoking})
  isWorking && condition.$and.push({"isWorking":isWorking})
  isStudyng && condition.$and.push({"isStudyng":isStudyng})
  maxBudget && condition.$and.push({"maxBudget":{$lte:maxBudget}})
  maxAge && condition.$and.push({"age":{$lte:maxAge}})
  minAge && condition.$and.push({"age":{$gte:minAge}})

  if (condition.$and.length === 0){
      condition = {};
  }

  User.find(condition).then(usersList =>{
      res.json(usersList) 
  })
  .catch(err => {
    res.json(err);
  })

});

module.exports = router;
