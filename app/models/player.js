var mongoose = require('mongoose');
var game = require('./game');
var Schema = mongoose.Schema;
var jwt = require("jsonwebtoken");
var fs = require("fs");
var crypto = require("crypto");

var interests = new Schema({
    game: { type: String, required: true, lowercase: true },
    ranking: { type: String, enum: ['Beginner', 'Medium', 'Advance'], default: 'Beginner', required: true }
});


var playerSchema = new Schema({
    playerName: {
        first: { type: String, required: true, trim: true},
        last: { type: String, required: true, trim: true}
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    opponentRanking: { type: String, enum: ['Beginner', 'Medium', 'Advance'], default: 'Beginner', required: true },
    playerRanking: { type: String, enum: ['Beginner', 'Medium', 'Advance'], default: 'Beginner', required: true },
    playerInterest: [interests]
});

playerSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

playerSchema.methods.validatePassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

playerSchema.methods.generateToken = function() {
    var tempDate = new Date();
    var expiry = new Date(tempDate);
    expiry.setMinutes(tempDate.getMinutes() + 30);      //lifespan of token -> 30 minutes...
    
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.playerName,
        exp: parseInt(expiry.getTime / 1000),
    }, fs.readFileSync("F:/House/Books/Semester 8/Web Programming/Project/keys/private.key", 'utf8'));           //change this to use from environemnt variable...
};

module.exports = mongoose.model('Player', playerSchema);