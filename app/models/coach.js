var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var coachSchema = new Schema({
    coachName: {
        first: { type: String, required: true, trim: true},
        last: { type: String, required: true, trim: true}
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 }
});


module.exports = mongoose.model('Coach', coachSchema);