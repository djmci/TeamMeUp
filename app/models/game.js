var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    game: { type: String, required: true, unique: true },
    courts: { type: Number, required: true },
    courtNames: [String]
});

module.exports = mongoose.model('game', gameSchema);