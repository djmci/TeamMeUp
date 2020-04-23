var mongoose = require('mongoose');
var game = require('./game');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

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
    password: { type: String, required: true, minlength: 6 },
    opponentRanking: { type: String, enum: ['Beginner', 'Medium', 'Advance'], default: 'Beginner', required: true },
    playerRanking: { type: String, enum: ['Beginner', 'Medium', 'Advance'], default: 'Beginner', required: true },
    playerInterest: [interests]
});


module.exports = mongoose.model('Player', playerSchema);