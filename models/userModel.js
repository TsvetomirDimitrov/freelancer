const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name:
	{
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	nickname: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String
	},
	city: {
		type: String
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String
	},
	skills: [{
		type: String
	}],
	googleId: String,
	facebookId: String,
	comments: [{
		title: String,
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'},
		text: String
	}]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

