const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const config = require('./config/database');
const morgan = require('morgan');
const passport = require("passport");
const cors = require('cors');

//local modules or models...
const api = require('./app/routes/api')(router);
require("./app/models/player");
require("./app/config/auth"); 

var port  = process.env.port || 3000;   //port we would be listening on, first argument is for deployment tools will come back to it later...

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/api', api);

//mongodb connection...
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, function(err) {
    if (err) console.log("MongoDB disconnected, err" + err);
    else console.log("MongoDB Connected!");
});

app.listen(port, function() {
    console.log("Server running on " + port);
});
