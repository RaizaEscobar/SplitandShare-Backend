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

router.get("/user/isFavorite/:id", (req, res, next) => {  
  User.findById(req.session.currentUser)
  .then((response) => {
   let index = response.favoriteFlatmates.indexOf(req.params.id);
   res.json(index > -1)
  })
  .catch((err) => {
    res.json(err);
  });
})

router.get("/users", (req, res, next) => {
  let {
    location,
    gender,
    maxAge,
    minAge,
    hasPet,
    isSmoking,
    isWorking,
    isStudying,
    maxBudget,
    limit
  } = req.query;

  limit = !limit ? 100 : parseInt(limit);

  let condition = { $and: [] };
  location && condition.$and.push({ "searchingFor.location": {$regex: new RegExp("^" + location.toLowerCase(), "i")} });
  gender && condition.$and.push({ gender: gender });
  hasPet && condition.$and.push({ hasPet: hasPet });
  isSmoking && condition.$and.push({ isSmoking: isSmoking });
  isWorking && condition.$and.push({ isWorking: isWorking });
  isStudying && condition.$and.push({ isStudying: isStudying });
  maxBudget && condition.$and.push({ maxBudget: { $lte: maxBudget } });
  maxAge && condition.$and.push({ age: { $lte: maxAge } });
  minAge && condition.$and.push({ age: { $gte: minAge } });

  if (condition.$and.length === 0) {
    condition = {};
  }

  User.find(condition).limit(limit)
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
  let favorites = currentUser.favoriteFlatmates;
  let index = favorites.indexOf(req.params.id);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(req.params.id);
  }

  User.findByIdAndUpdate(req.session.currentUser, {
    favoriteFlatmates: favorites,
  })
    .then(() => {
      res.json({
        message: `Favorite flatmates have been updated successfully.`,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/users/favorites', (req, res, next)=>{
  User.findById(req.session.currentUser).populate('favoriteFlatmates').exec((err,users)=>{
    res.json(users.favoriteFlatmates)
  })
})

router.get("/users/suggested", async (req, res, next) => {
  let currentUser = await User.findById(req.session.currentUser);
  let minBudget = currentUser.maxBudget - 100
  let maxBudget = currentUser.maxBudget + 100
  let condition = {
    $and: [
      { "maxBudget": { $gte:  minBudget} },
      { "maxBudget": { $lte: maxBudget } },
      { "age": { $gte: currentUser.searchingFor.minAge } },
      { "age": { $lte: currentUser.searchingFor.maxAge } },
      { "searchingFor.maxAge": { $gte: currentUser.age } },
      { "searchingFor.minAge": { $lte: currentUser.age } },      
      {
        $or: [
          { "searchingFor.gender": currentUser.gender },
          { "searchingFor.gender": "indifferent" },
        ],
      },      
      {
        $or: [
          { "searchingFor.smoke": currentUser.isSmoking.toString() },
          { "searchingFor.smoke": "indifferent" },
        ],
      },      
      {
        $or: [
          { "searchingFor.pets": currentUser.hasPet.toString() },
          { "searchingFor.pets": "indifferent" },
        ],
      },
    ],
  };

  if(currentUser.searchingFor.gender != "indifferent")
  {
    condition.$and.push({ "gender": currentUser.searchingFor.gender });
  }
  if(currentUser.searchingFor.smoke != "indifferent")
  {
    condition.$and.push({ "isSmoking": currentUser.searchingFor.smoke == "true" });
  }
  if(currentUser.searchingFor.pets != "indifferent")
  {
    condition.$and.push({ "hasPet": currentUser.searchingFor.pets == "true" });
  }  
  User.find(condition)
  .then((usersList) => {
    res.json(usersList);
  })
  .catch((err) => {
    res.json(err);
  });

});



module.exports = router
