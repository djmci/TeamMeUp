var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var adminSchema = new Schema({
    username: {type: String, unique: true, lowercase:true, trim: true, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 }
});

adminSchema.pre('save', function(next) {
    var user = this;
    user.username = user.username.replace(/\s/g, '');
    next();
});

module.exports = mongoose.model('Admin', adminSchema);