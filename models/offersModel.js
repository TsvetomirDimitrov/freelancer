const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/freelance', { useNewUrlParser: true });


const offerSchema = new Schema({
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

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;

