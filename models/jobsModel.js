const mongoose = require('mongoose');
const Schema = mongoose.Schema;
	
const jobSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	deadline: {
		type: String,
		required: true
	},
	category:{
		type: String,
		required: true
	},
	tags: [{
		type: String
	}],
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

