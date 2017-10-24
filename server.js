//require all dependencies
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	config = require('./config');
	Users = require('./models/users'),
	port = process.env.PORT || 3000;
//connecting to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb, {useMongoClient: true});
//secret key for tokens
app.set('secretKey', config.key);
//use bodyParse to get parameters from request
app.use(bodyParser.urlencoded({	extended: true	}));
app.use(bodyParser.json());

//for testing purpose
app.use(morgan('dev'));

//routes will go here
var routes = require('./routes');
routes(app);

//start server at 3000 port
app.listen(port);
console.log('Server started at port: '+port);