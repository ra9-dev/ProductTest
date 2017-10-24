var mongoose = require('mongoose');
	User = mongoose.model('users');

exports.create = function (req, res) {
	//create a first time user
	var dummyUser = new User({
		username: 'dummyuser',
		email: 'user@dummy.com',
		password: 'dummypassword'
	});
	dummyUser.save(function(err){
		if(err) {
			res.json({	success: false,
						reason: 'Cant create dummy user more than once. Contact developer.' });
		}
		else {
			console.log('dummy user created');
			res.json({ success: true });
		}
	})
}