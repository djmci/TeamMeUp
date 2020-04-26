var mongoose = require('mongoose');
var Player = require('../models/player');

module.exports.profileRead = function(req, res) {
  console.log("Trying to view profile");
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    Player.findById(req.payload._id).exec(function(err, user) {
        res.status(200).json(user);
      });
  }

};