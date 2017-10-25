//define routes here
module.exports = function(app) {
	//entry route
	app.route('/')
		.get(function(req, res){
			res.json({ message: 'main page'});
		});
	
	//route to add dummy user. will work only once
	var dummy = require('./controllers/initSetup');
	app.route('/dummy-setup')
		.get(dummy.create);
	//route to perform action on users collection
	var user = require('./controllers/userController');
	app.route('/login')
		.post(user.authenticate);
	//this will check for tokens
	app.use(user.verifyToken);
	//after this, all API requests require jwt token to proceed.
	//user api to signup
	app.route('/signup')
		.post(user.register);
	//products CRUD operations RESTful APIs
	var products = require('./controllers/productsController')
	app.route('/products')
		.post(products.addNew)
		.get(products.getAll);
	app.route('/products/bulk')
		.post(products.addInBulk);
	app.route('/products/search/:tags')
		.get(products.searchTags);
	app.route('/products/:code')
		.get(products.getOne)
		.put(products.update)
		.delete(products.delete);
}