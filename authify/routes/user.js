const { Router } = require("express");
const bcrypt = require("bcrypt");
const auth = require("../middleware/authM");

// Import Model
const User = require("../models/User");

// Create a Router
const router = new Router();

router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Loads the signup form
router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/current", auth, (req, res) => {
  res.render("auth/dashboard", { user: req.user });
});

// Checks
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    const token = user.generateAuthToken();

    if (!user) return res.status(404).send("User not found");

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (!result) return res.status(400).send("Invalid Password");

      // const token = user.generateAuthToken();
      // res.header("x-access-token", token).send({
      //   _id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   token: token,
      // });
      res.cookie("auth", token);
      res.redirect("/auth/current");
    });
  });
});

// Register and Add a User Account
router.post("/register", (req, res) => {
  // validate the request body first
  //   const { error } = validate(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) return res.status(400).send("User already registered.");
    user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });
    bcrypt.genSalt(10, (err, salt) => {
      if (err) next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) next(err);
        user.password = hash;
        user.save().then((user) => {
          const token = user.generateAuthToken();
          // res.header("x-access-token", token).send({
          //   _id: user._id,
          //   name: user.name,
          //   email: user.email,
          //   token: token,
          // });

          res.cookie("auth", token);
          res.redirect("/auth/current");
        });
      });
    });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

module.exports = router;
