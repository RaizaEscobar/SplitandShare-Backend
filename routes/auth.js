const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//  POST '/signup'

router.post(
  "/signup",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const emailExists = await User.findOne({ email }, "email");
      if (emailExists) return next(createError(400, "the user already exists"));
      else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        const newUser = await User.create({ email, password: hashPass });
        req.session.currentUser = newUser;
        res.status(200).json(newUser);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.post(
  "/login",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
       return next(createError(404), "the user does not exist");
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
     return next(createError(401), "the password is not correct");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.post("/logout", isLoggedIn(), (req, res, next) => {
  req.session.destroy();

  res.status(204).send();
  return;
});

router.get("/private", isLoggedIn(), (req, res, next) => {
  res.status(200).json({ message: "Test - User is logged in" });
});

// GET '/me'

router.get("/me", isLoggedIn(), (req, res, next) => {
  req.session.currentUser.password = "*";
  res.json(req.session.currentUser);
});

module.exports = router;
