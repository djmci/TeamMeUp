const Player = require('../models/player');
const jwt = require('jsonwebtoken');
const config = require('../../config/database')

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
                            username: req.body.username,
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
                                    console.log(err);
                                    if(err.keyValue.hasOwnProperty('username')) {
                                        res.json({ success: false, message: "Choose a unique username!" });
                                    } else if (err.keyValue.hasOwnProperty('email')) {
                                        res.json({ success: false, message: "Choose a unique email!" });
                                    }
                                } else {
                                    res.json({ success: false, message: "Could not save user! Error: " });
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

    router.post('/login', (req, res) => {
        if (!req.body.username) {
          res.json({ success: false, message: 'No username was provided' });
        } else {
          if (!req.body.password) {
            res.json({ success: false, message: 'No password was provided.' });
          } else {
            Player.findOne({ username: req.body.username }, (err, user) => {
              if (err) {
                res.json({ success: false, message: err });
              } else {
                if (!user) {
                  res.json({ success: false, message: 'Username not found.' });
                } else {
                  const validPassword = user.comparePassword(req.body.password);
                  if (!validPassword) {
                    res.json({ success: false, message: 'Password invalid' });
                  } else {
                    //   res.json({ success: true, message: "Logged IN!"});
                    const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                    res.json({ success: true, message: 'Success!', token: token, user: { username: user.username } });
                  }
                }
              }
            });
          }
        }
      });

    router.use(function(req, res, next) {
        const token = req.headers['authorization'];
        if (!token) res.json({success: false, message: "No token provided."});
        else jwt.verify(token,  config.secret, function(err, result) {
            if(err) res.json({ success: false, message: "Tokein invalid: " + err});
            else { 
                req.result = result;
                next();
            }
        })
    });
      
    router.get('/profile', (req, res) => {
        Player.findOne({ _id: req.result.userId}).select('username email').exec((err, player) => {
            if (err) res.json({success: false, message: "Couldn't find selected fields! " + err });
            else {
                if(!player) res.json({success: false, message: "User not found!"});
                else res.json({success: true, message: player });
            }
        })
    });

    return router;
});

