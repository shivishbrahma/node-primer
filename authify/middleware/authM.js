const jwt = require("jsonwebtoken");
const { Router } = require("express");
const router = Router();
const User = require("../models/User");

router.use((req, res, next) => {
  //get the token from the header if present
  // const token = req.headers["x-access-token"] || req.headers["authorization"];
  const token = req.cookies.auth;
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.API_KEY);

    User.findOne({ _id: decoded._id }).then((user) => {
      req.user = user;
      next();
    });
  } catch (ex) {
    //if invalid token
    res.status(400).send("Invalid token.");
  }
});

module.exports = router;
