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
			res.json({
				success: false,
				message: 'Cant create dummy data more than once. Refer the provided doc.'
			});
		}
		else {
			createDummyProducts(req, res);
		}
	});
}

var createDummyProducts = function(req, res) {
	var products = require('./productsController');
	req.body.products = [
		{sku:'sdc020ab', name:'macbook', description: '12inch 2017 model', category: 'electronics', price: '1,05,000', tags: ['macbook'], attributes: {color: 'rose gold', size: '12inch', subcategory: 'laptop', brand: 'apple', year: '2017'}},
		{sku:'sdc010ab', name:'macbook air', description: '13inch 2016 model', category: 'electronics', price: '52,000', tags: ['macbook'], attributes: {color: 'silver', size: '13inch', subcategory: 'laptop', brand: 'apple', year: '2016'}},
		{sku:'sdc011ab', name:'macbook air', description: '13inch 2017 model', category: 'electronics', price: '65,000', tags: ['macbook'], attributes: {color: 'grey', size: '13inch', subcategory: 'laptop', brand: 'apple', year: '2017'}},
		{sku:'des213ds', name:'iphone 7', category: 'electronics', price: '45,000', tags: ['iphone'], attributes: {color: 'gold', size: '5inch', subcategory: 'mobile', brand: 'apple', year: '2016', model: '7'}},
		{sku:'des215gs', name:'iphone 6s', category: 'electronics', price: '30,000', tags: ['iphone'], attributes: {color: 'grey', size: '5inch', subcategory: 'mobile', brand: 'apple', year: '2017', model: '6s'}},
		{sku:'dev355gs', name:'oneplus 3T', category: 'electronics', price: '30,000', discount: '4,0000', attributes: {color: 'gunmetal', size: '5.5inch', subcategory: 'mobile', brand: 'oneplus', year: '2016', model: '3T'}},
		{sku:'dev455gs', name:'oneplus 5', category: 'electronics', price: '33,000', discount: '2,0000', attributes: {color: 'black', size: '5.5inch', subcategory: 'mobile', brand: 'oneplus', year: '2017', model: '5'}},
		{sku:'dev501gs', name:'pixel 2', category: 'electronics', price: '65,000', tags: ['pixel'], attributes: {color: 'black', size: '5inch', subcategory: 'mobile', brand: 'google', year: '2017', model: '2'}},
		{sku:'dev501gf', name:'pixel 2', category: 'electronics', price: '65,000', tags: ['pixel'], attributes: {color: 'white', size: '5inch', subcategory: 'mobile', brand: 'google', year: '2017', model: '2'}}
	];
	products.addInBulk(req, res);
}