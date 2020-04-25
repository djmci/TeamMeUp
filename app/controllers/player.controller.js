var Player = require('../models/player')
var passport = require('passport');

exports.insert = function(req, res) {
    var player = new Player();

    player.playerName = req.body.playerName;
    player.email = req.body.email;
    player.setPassword(req.body.password);
    player.playerRanking = req.body.playerRanking;
    player.opponentRanking = req.body.opponentRanking;
    player.playerInterests = req.body.playerInterests;

    error = player.validateSync();
    if (error) {
        res.send("Something is wrong with the values entered!" + error);
    } else {
        player.save(function(err) {
            var token = player.generateToken();
            if(err){
                res.send("Email already exists! Duplicate Email.")
            } else{
                res.send(player.playerName + " added succesfully to MongoDB! Token: " + token);
            }
        });
    }
}


exports.login = function(req, res) {
    passport.authenticate('local', function(err, user, info) {
        var token;
        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }
  
        // If a user is found
        if(user){
            token = user.generateToken();
            res.status(200);
            res.json({
            "token" : token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);
  
};
