var mongoose = require('mongoose'),
	Product = mongoose.model('products');

exports.addNew = async function(req, res) {
	var result = await addProductToMongo(req.body);
	res.json(result);
}

exports.addInBulk = async function(req, res) {
	var products = req.body.products;
	if(!products || products.length <= 0)
		res.json('No Products to Add');
	else {
		var result = [];
		for (var i = 0; i < products.length; i++) {
			result[i] = {};
			result[i]['request'] = products[i];
			var response = await addProductToMongo(products[i]);
			result[i]['response'] = response;
		}
		res.json(result);
	}
}

exports.getAll = function(req, res) {
	Product.find({}, function(err, products) {
		if(err) {
			res.json({
				success: false,
				message: 'No Products to show.'
			});
		}
		else {
			res.json({
				success: true,
				products: products
			});
		}
	});
}

exports.searchTags = function(req, res) {
	Products.find({
		$text: {
			$search: req.params.tags
		}}, {
			score: {
				$meta: 'textScore'
			}
		}, {
			sort: {
				score: {
					$meta: 'textScore'
				}
			}
		}, function(err, products) {
		if(err) {
			res.json({
				success: false,
				message: 'No Products to show.'
			});
		}
		else {
			res.json({
				success: true,
				products: products
			});
		}
	});
}

exports.getOne = function(req, res) {
	Product.findOne({code: req.params.code}, function(err, product) {
		if(err) {
			res.json({
				success: false,
				message: 'No matching product.'
			});
		}
		else {
			res.json({
				success: true,
				products: product
			});
		}
	});
}

exports.update = function(req, res) {
	Product.findOne({code: req.params.code}, async function(err, productData) {
		if(err || !productData) {
			res.json({
				success: false,
				message: 'No matching product.'
			});
		}
		else {
			req.body.tags = await getUpdatedTags(productData, req.body);
			Product.findOneAndUpdate({code: req.params.code}, {$set: req.body}, {new: true}, function (err, updatedProduct) {
				if(err) {
					res.json({
						success: false,
						message: 'Something happened, cant update. Please check the error.',
						error: err
					});
				}
				else {
					res.json({
						success: true,
						message: 'Product updated.',
						products: updatedProduct
					});
				}
			});
		}
	});
}

exports.delete = function(req, res) {
	Product.findOneAndRemove({code: req.params.code}, function(err, product) {
		if(err) {
			res.json({
				success: false,
				message: err
			});
		}
		else if(product) {
			res.json({
				success: true,
				message: 'Product with code: ' + req.params.code + ' deleted.'
			});
		}
		else {
			res.json({
				success: false,
				message: 'No matching product.'
			})
		}
	});
}

var addProductToMongo = async function(productData) {
	try {
		if(!productData.sku || !productData.name || !productData.price || !productData.attributes || Object.keys(productData.attributes) <= 0) {
			return {
				success: false,
				message: 'You missed some required fields. Please refer the doc for main info.'
			};
		}
		else {
			if(!productData.category)
				productData.category = 'Others';
			var tags = await getUpdatedTags(productData);
			var newProduct = new Product({
				sku: productData.sku,
				name: productData.name,
				description: productData.description || '',
				category: productData.category,
				tags: tags,
				price: productData.price,
				discount: productData.discount || '0',
				instock: productData.instock || 'true',
				attributes: productData.attributes
			});
			return await newProduct.save(function(err){
				if(err) {
					return {
						success: false,
						message: err
					};
				}
				else {
					return {
						success: true
					};
				}
			});
		}
	} catch(err) {
		return {
			success: false,
			message: 'Something went wrong.',
			error: err
		}
	}
}

var getUpdatedTags = async function(productData, newData=null) {
	var customTags = [];
	if(newData) {
		//update productData to newData for updating tags
		for (var key in newData)
			productData.key = newData.key;
		customTags = newData.tags || '';
	}
	else
		//if its a new document custom tags will be fetched from productData
		customTags = productData.tags;
	var tags = [productData.name, productData.category];
	if(customTags)
		tags = tags.concat(customTags, Object.values(productData.attributes));
	else
		tags = tags.concat(Object.values(productData.attributes));
	tags = await convertArrayToLowerCase(tags);
	return tags;
}

var convertArrayToLowerCase = function(tagArray) {
	var convertedArray = [];
	for (var i = 0; i < tagArray.length; i++)
		convertedArray.push(tagArray[i].toLowerCase());
	return convertedArray;
}