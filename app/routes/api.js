const Player = require('../models/player');

module.exports = (router => {
    
    router.post('/register', (req, res) => {
        if(!req.body.email) {
            res.json({ success: false, message: "Email not found!"});           //this is all just validation testing, hoping it doesn't break...
        } else {
            if (!req.body.username) {
                res.json({ success: false, message: "Username not found!"});
            } else {
                if (!req.body.password) {
                    res.json({ success: false, message: "Password not found!"});
                } else {
                    if (!req.body.name) {
                        res.json({ success: false, message: "name not found!"});
                    } else {
                        console.log(req.body);
                        var player = Player({
                            username: req.body.username.toLowerCase(),
                            email: req.body.email.toLowerCase(),
                            password: req.body.password,
                            name: req.body.name,
                            opponentRanking: req.body.opponentRanking,
                            playerRanking: req.body.playerRanking,
                            playerInterest: req.body.playerInterest
                        });
                        player.save((err) => {
                            if(err) {
                                if(err.code === 11000) {
                                    res.json({ success: false, message: "Player already exists!" });
                                } else {
                                    res.json({ success: false, message: "Could not save user! Error: " + err });
                                };
                            } else {
                                res.json({ success: true, message: "Player Saved!"});
                            };
                        });
                    }
                }
            }
        }
    });

    return router;
})

