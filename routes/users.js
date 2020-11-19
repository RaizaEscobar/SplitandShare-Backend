var express = require("express");
var router = express.Router();
const User = require("../models/user");

const uploader = require("../configs/cloudinary-setup");

router.post("/improveMyProfile/:id", (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: `User is updated successfully.` });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post(
  "/uploadPicture/:id",
  uploader.single("image"),
  (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, { image: req.file.secure_url })
      .then(() => {
        res.json({ message: `User is updated successfully.` });
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

router.get("/profile/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/users", (req, res, next) => {
  let {
    location,
    gender,
    maxAge,
    minAge,
    hasPet,
    isSmoking,
    isWorking,
    isStudyng,
    maxBudget,
  } = req.query;

  let condition = { $and: [] };
  location && condition.$and.push({ location: location });
  gender && condition.$and.push({ gender: gender });
  hasPet && condition.$and.push({ hasPet: hasPet });
  isSmoking && condition.$and.push({ isSmoking: isSmoking });
  isWorking && condition.$and.push({ isWorking: isWorking });
  isStudyng && condition.$and.push({ isStudyng: isStudyng });
  maxBudget && condition.$and.push({ maxBudget: { $lte: maxBudget } });
  maxAge && condition.$and.push({ age: { $lte: maxAge } });
  minAge && condition.$and.push({ age: { $gte: minAge } });

  if (condition.$and.length === 0) {
    condition = {};
  }

  User.find(condition)
    .then((usersList) => {
      res.json(usersList);
    })
    .catch((err) => {
      res.json(err);
    });
});


//ruta para guardar un flatmate como favorito

router.post("/idealFlatmate/:id", async (req, res, next) => {
  let currentUser = await User.findById(req.session.currentUser);
  let favorites = currentUser.favoriteFlatmates
  let index = favorites.indexOf(req.params.id)
 
  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(req.params.id)
  }
 
  User.findByIdAndUpdate(req.session.currentUser, {"favoriteFlatmates" : favorites})
  .then(() => {
   res.json({ message: `Favorite flatmates have been updated successfully.` });
 })
 .catch(err => {
   res.json(err);
 })
   
 }); 

//ruta para enseñar el perfil de cada "flatmate"

 router.get('/idealFlatmate/:id', (req, res, next)=>{

  User.findById(req.params.id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.json(err);
    })
})

module.exports = router;
