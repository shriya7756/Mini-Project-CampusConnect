const mongoose = require('mongoose');

const exchangeItemSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		category: { type: String, required: true },
		price: { type: Number, required: true },
		condition: { type: String, required: true },
		tags: [{ type: String }],
		images: [{ type: String }],
		contact: {
			phone: String,
			email: String,
			location: String,
		},
		seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		views: { type: Number, default: 0 },
		interestedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

const ExchangeItem = mongoose.model('ExchangeItem', exchangeItemSchema);

module.exports = ExchangeItem;

