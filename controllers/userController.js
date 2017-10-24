var mongoose = require('mongoose');
	User = mongoose.model('users');
	jwt = require('jsonwebtoken');
	config = require('../config');

exports.getAllUsers = function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
}

exports.authenticate = async function(req, res) {
	var userObj = [];
	try {
		await User.findOne({
			username: req.body.username
		}, function(err, user) {
			try {
				if(err)
					throw('There is some problem. Contact developer.');
				else if(!user)
					throw('Invalid UserName.');
				else if(req.body.password != user.password)
					throw('Wrong password.');
				else
					userObj = user;
			} catch(err) {
				sendErrMsg(err, res);
			}
		});
	} catch(err) {
		sendErrMsg(err, res);
	}
	if(Object.keys(userObj).length > 0) {
		var token = generateToken(userObj.username);
		res.json({
			success: true,
			token: token,
			message: 'Use this API token for authentication'
		});
	}
}

exports.getUser = function(req, res) {
	console.log('reached here in get user');
	console.log(req.params.id);
	res.send("completed");
}

exports.verifyToken = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token) {
		jwt.verify(token, config.key, function(err, userDetails) {
			if(err) {
				return res.json({
					success: false,
					message: 'Failed to authenticate token.'
				});
			}
			else {
				req.userDetails = userDetails;
				next();
			}
		})
	}
	else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
}

var generateToken = function(username) {
	const payload = {
		username: username
	};
	var token = jwt.sign(payload, config.key, {
		expiresIn: '1440m'
	});
	return token;
}

function sendErrMsg(msg, res) {
	res.status(401).json({
		success: false,
		message: msg
	})
}