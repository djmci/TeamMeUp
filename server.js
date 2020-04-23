const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/database');
const morgan = require('morgan');

//local modules or models...
const PlayerController = require('./app/controllers/player.controller');
const AdminController = require('./app/controllers/admin.controller');
const CoachController = require('./app/controllers/coach.controller');
const GameController = require('./app/controllers/game.controller');

var port  = process.env.port || 3000;   //port we would be listening on, first argument is for deployment tools will come back to it later...

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mongodb connection...
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, function(err) {
    if (err) console.log("MongoDB disconnected, err" + err);
    else console.log("MongoDB Connected!");
});


app.post('/api/users', [
    PlayerController.insert
]);
app.post('/api/admins', [
    AdminController.insert
]);
app.post('/api/coaches', [
    CoachController.insert
]);
app.post('/api/games', [
    GameController.insert
])

app.listen(port, function() {
    console.log("Server running on " + port);
});
