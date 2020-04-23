const crypto = require('crypto');
var Player = require('../models/player')


exports.insert = function(req, res) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;

    var player = new Player();
    player.playerName = req.body.playerName;
    player.email = req.body.email;
    player.password = req.body.password;
    player.playerRanking = req.body.playerRanking;
    player.opponentRanking = req.body.opponentRanking;
    player.playerInterests = req.body.playerInterests;

    error = player.validateSync();
    if (error) {
        res.send("Something is wrong with the values entered!" + error);
    } else {
        player.save(function(err) {
            if(err){
                res.send("Email already exists! Duplicate Email.")
            } else{
                res.send(player.playerName + " added succesfully to MongoDB");
            }
        });
    }
}


