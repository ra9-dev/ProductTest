var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//model for mongoDb collection with name of 'users' for maintaining user info. For now it will have fields name, email, password.
module.exports = mongoose.model('users', new Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true,
		required: true
	},
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	runSettersOnQuery: true,
	timestamps: true,
	strict: false
}));