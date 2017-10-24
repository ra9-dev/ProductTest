var mongoose = require('mongoose'),
	config = require('../config'),
	User = mongoose.model('users');

exports.create = function (req, res) {
	//create a first time user
	var dummyUser = new User({
		username: 'dummyuser',
		email: 'user@dummy.com',
		//dummypassword encrypted
		password: 'c56f147bdedfcffc76dd4abdb08bce3c733bebfb38de04a8aba6eebd739a8c0eb4172301e499c143a0e68c49d6a8943befa98d12b2e2fe22c2f264066e472fa3'
	});
	dummyUser.save(function(err){
		if(err) {
			res.json({	success: false,
						message: 'Cant create dummy user more than once. Contact developer.' });
		}
		else {
			res.json({ success: true });
		}
	});
}