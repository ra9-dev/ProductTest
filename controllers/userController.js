var mongoose = require('mongoose'),
	User = mongoose.model('users'),
	jwt = require('jsonwebtoken'),
	crypto = require('crypto'),
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
					throw('There is some problem. Refer the doc provided.');
				else if(!user)
					throw('Invalid UserName.');
				else if(user.password != hashPassword(req.body.password)) {
					console.log(user.password);
					var test = hashPassword(req.body.password);
					console.log(test);
					console.log(test == user.password);
					throw('Wrong password.');
				}
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
			message: 'Use this API token for authentication as described in provided doc.'
		});
	}
}

exports.register = function(req, res) {
	var userObj = new User({
		username: req.body.username,
		email: req.body.email,
		password: hashPassword(req.body.password)
	});
	userObj.save(function(err){
		if(err) {
			res.json({
				success: false,
				message: err
			});
		}
		else {
			res.json({ success: true });
		}
	});
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

var hashPassword = function(password) {
	var hash = crypto.createHmac('sha512', config.salt); /** Hashing algorithm sha512 */
	hash.update(password);
	var value = hash.digest('hex');
	return value;
};

var generateToken = function(username) {
	const payload = {
		username: username
	};
	var token = jwt.sign(payload, config.key, {
		expiresIn: '1h'
	});
	return token;
}

function sendErrMsg(msg, res) {
	res.status(401).json({
		success: false,
		message: msg
	})
}