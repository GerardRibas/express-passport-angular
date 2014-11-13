var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var jwt = require('jwt-simple');
var moment = require('moment');
var jwtauth = require('./app/jwt-auth.js');
var config = require('./config/config.js');

//Configuration:
mongoose.connect(config.mongodbUrl);
require('./config/passport')(passport);

//Set Up Express App:
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public/app'));
app.use(bodyParser.urlencoded({'extended' : 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type : 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(passport.initialize());

//Routes:
require('./app/routes.js')(app, passport, jwt, moment, config, jwtauth);

//Launch:
app.listen(port);
console.log('Started application on port ' + port);