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

var addProductToMongo = async function(productData) {
	try {
		if(!productData.sku || !productData.name || !productData.price) {
			return {
				success: false,
				message: 'You missed some required fields. Please refer the doc for main info.'
			};
		}
		else {
			if(!productData.category)
				productData.category = 'Others';
			var tags = [productData.name, productData.category];
			if(productData.tags)
				tags = tags.concat(productData.tags, Object.values(productData.attributes));
			else
				tags = tags.concat(Object.values(productData.attributes));
			tags = await convertArrayToLowerCase(tags);
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

var convertArrayToLowerCase = function(tagArray) {
	var convertedArray = [];
	for (var i = 0; i < tagArray.length; i++)
		convertedArray.push(tagArray[i].toLowerCase());
	return convertedArray;
}