const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const offerSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	startingPrice: {
		type: Number,
		required: true
	},
	packages: [{
		packageType: {
			type: String,
			required: true
		},
		packagePrice: {
			type: Number,
			required: true
		},
		packageDescription: {
			type: String,
			required: true
		},
		packageRevisions: {
			type: Number, 
			required: true
		},
		packageDeliveryTime: {
			type: Number,
			required: true
		}

	}],
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;

