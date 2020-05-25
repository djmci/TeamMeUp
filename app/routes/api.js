const Player = require('../models/player');
const Coach = require('../models/coach');
const Game = require('../models/game');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const config = require('../../config/database')


module.exports = (router => {
    
    router.get('/gamesList', (req, res) => {
        Game.find({}, function(err, games) {
            res.json({success: true, message: games});
         });
    })

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
                        if(req.body.role == 'player') {
                            console.log(req.body);
                            var player = Player({
                                username: req.body.username,
                                email: req.body.email.toLowerCase(),
                                password: req.body.password,
                                name: req.body.name,
                                opponentRanking: req.body.opponentRanking,
                                playerRanking: req.body.playerRanking,
                                playerInterest: req.body.playerInterest,
                                Interests: req.body.Interests,
                                lastLogin: null
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
                                        res.json({ success: false, message: "Could not save user! Error: " + err });
                                    };
                                } else {
                                    res.json({ success: true, message: "Player Saved!"});
                                };
                            });
                        } else if (req.body.role == 'coach') {
                            console.log(req.body);
                            var coach = Coach({
                                username: req.body.username,
                                email: req.body.email.toLowerCase(),
                                password: req.body.password,
                                name: req.body.name
                            });
                            coach.save((err) => {
                                if(err) {
                                    if(err.code === 11000) {
                                        console.log(err);
                                        if(err.keyValue.hasOwnProperty('username')) {
                                            res.json({ success: false, message: "Coach: Choose a unique username!" });
                                        } else if (err.keyValue.hasOwnProperty('email')) {
                                            res.json({ success: false, message: "Coach: Choose a unique email!" });
                                        }
                                    } else {
                                        res.json({ success: false, message: "Could not save user! Error: " + err});
                                    };
                                } else {
                                    res.json({ success: true, message: "Coach Saved!"});
                                };
                            });
                        }
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
              if(req.body.role == 'player') {
                    Player.findOne({ username: req.body.username }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Username not found.' });
                            } else {
                            if(user.role != req.body.role) {
                                res.json({ success: false, message: 'Please ensure that you are a ' + req.body.role + "." });
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
                    }
                    });
                } else if (req.body.role == 'coach') {
                    Coach.findOne({ username: req.body.username }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Username not found.' });
                            } else {
                            if(user.role != req.body.role) {
                                res.json({ success: false, message: 'Please ensure that you are a ' + req.body.role + "." });
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
                    }
                    });
                } else if (req.body.role == 'admin') {
                    Admin.findOne({ username: req.body.username }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Username not found.' });
                            } else {
                            if(user.role != req.body.role) {
                                res.json({ success: false, message: 'Please ensure that you are an ' + req.body.role + "." });
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
                    }
                    });
                }
          }
        }
      });

      router.post('/addSchedule', (req, res) => {
          if (!req.body.username) {
            res.json({ success: false, message: "username not found!"});
          } else {
              if (!req.body.schedule) {
                res.json({ success: false, message: "Schdule not found!"}); 
              } else {
                Player.findOne({ username: req.body.username }, (err, user) => {
                    console.log(req.body.schedule);
                    var newPlayer = user;
                    newPlayer.schedule = req.body.schedule;
                    newPlayer.lastLogin = Date.now();
                    console.log(newPlayer);
                    Player.findOneAndUpdate({username: req.body.username}, newPlayer,  function(err, doc) {
                        if (err) res.json({success: false, message: "Some error occured!" + err});
                        res.json({success: true, message: "Records entered succesfully! Welcome!"});
                    })
                });
              }
          }
      })

      router.post('/games', (req, res) => {
        if (!req.body.name) {
            res.json({success: false, message: "Game name not provided!"});
        } else {
            if (!req.body.courtNames) {
                res.json({success: false, message: "Please specify number of courts."});
            } else {
                var game = Game({
                    name: req.body.name,
                    courtNames: req.body.courtNames
                });
                game.save((err) => {
                    if(err) {
                        if(err.code === 11000) {
                            console.log(err);
                            if(err.keyValue.hasOwnProperty('name')) {
                                res.json({ success: false, message: "Choose a unique game name!" });
                            }
                        } else {
                            res.json({ success: false, message: "Could not save game! Error: " + err });
                        };
                    } else {
                        res.json({ success: true, message: "Game Saved!"});
                    };
                });
            }
        }
    });

    router.use(function(req, res, next) {
        const token = req.headers['authorization'];
        if (!token) res.json({success: false, message: "No token provided."});
        else jwt.verify(token,  config.secret, function(err, result) {
            if(err) res.json({ success: false, message: "Token invalid: " + err});
            else { 
                req.result = result;
                next();
            }
        })
    });
    
    router.get('/getplayer', (req, res) => {
        Player.findOne({ _id: req.result.userId }).select('username email role name playerRanking opponentRanking playerInterest').exec((err, player) => {
            if (err) res.json({success: false, message: "Couldn't find selected fields! " + err});
            else res.json({success: true, message: player});
        });
    });

    

    router.get('/profile', (req, res) => {
        Player.findOne({ _id: req.result.userId }).select('username email role lastLogin attendence').exec((err, player) => {
            if (err) res.json({success: false, message: "Couldn't find selected fields! " + err });
            else {
                if(!player) {
                    console.log("No player found, checking coaches.");
                    Coach.findOne({ _id: req.result.userId }).select('username email role').exec((err, coach) => {
                        if (err) res.json({success: false, message: "Couldn't find selescted fields for coach!" + err});
                        else {
                            if(!coach) {
                                console.log("No coach found, checking admins");
                                Admin.findOne({ _id: req.result.userId }).select('username email role').exec((err, admin) => {
                                    if(err) res.json({ success: false, message: "Couldn't find selected fields for admin!" + err});
                                    else {
                                        if(!admin) {
                                            console.log("No admin found");
                                            res.json({success: false, message: "No profile found for the user"});
                                        }
                                        else res.json({success: true, message: admin });
                                    }
                                });
                            } else res.json({success: true, message: coach});
                        }
                    });
                } else {
                    var newPlayer = player;
                    newPlayer.attendence = Date.now();
                    console.log(newPlayer);
                    Player.findOneAndUpdate({username: req.body.username}, newPlayer,  function(err, doc) {
                        if (err) console.log("Error " + err);
                        console.log("Attendence updated!");
                    })
                    res.json({success: true, message: newPlayer });
                }
            }
        })
    });

    return router;
});

