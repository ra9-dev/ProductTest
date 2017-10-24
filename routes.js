//define routes here
module.exports = function(app) {
	//entry route
	app.route('/')
		.get(function(req, res){
			res.json({ message: 'main page'});
		});
	
	//route to add dummy user. will work only once
	var dummy = require('./controllers/dummyUser');
	app.route('/dummy-setup')
		.get(dummy.create);
	
	//route to perform action on users collection
	var user = require('./controllers/userController');
	app.route('/authenticate')
		.post(user.authenticate);
	//this will check for tokens
	app.use(user.verifyToken);
	//after this, all API requests require jwt token to proceed.
	app.route('/user/:id')
		.get(user.getUser);
}