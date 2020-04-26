const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const config = require('./config/database');
const morgan = require('morgan');
const passport = require("passport");

//local modules or models...
const api = require('./app/routes/api')(router);
require("./app/models/player");
require("./app/config/auth"); 

var port  = process.env.port || 3000;   //port we would be listening on, first argument is for deployment tools will come back to it later...

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});
app.use('/api', api);

//mongodb connection...
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, function(err) {
    if (err) console.log("MongoDB disconnected, err" + err);
    else console.log("MongoDB Connected!");
});


app.get('*', (req, res) => {
    res.send('<h1>Hello World</h1>');
})

app.listen(port, function() {
    console.log("Server running on " + port);
});
