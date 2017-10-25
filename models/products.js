var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sequenceGenerator = require('mongoose-sequence-plugin');

var productsSchema = new Schema({
	sku: {
		type: String,
		required: true,
		unique: true
	},
	code: String,
	name: {
		type: String,
		required: true
	},
	description: String,
	category: {
		type: String,
		required: true,
		default: 'Others'
	},
	tags: Array,
	price: {
		type: String,
		required: true
	},
	discount: String,
	instock: {
		type: Boolean,
		required: true,
		default: true
	},
	attributes: Schema.Types.Mixed	//color, brand, sub-category and all other attributes will be added here
}, {
	runSettersOnQuery: true,
	timestamps: true
});

productsSchema.index({
	'name': 'text',
	'tags': 'text',
	'attributes.subcategory': 'text',
	'description': 'text'
}, {
	weights: {
		'name': 5,
		'tags': 4,
		'attributes.subcategory': 3,
		'description': 2
	}
});

productsSchema.plugin(sequenceGenerator, {
	field: 'code',
	startAt: '00001',
	prefix: 'OSPI'	//Online Store Product Id
});

module.exports = mongoose.model('products', productsSchema);