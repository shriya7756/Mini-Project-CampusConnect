const mongoose = require('mongoose');

async function connectDb() {
	const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect';
	mongoose.set('strictQuery', true);
	await mongoose.connect(mongoUri, {
		// options left default in Mongoose v8
	});
	console.log('MongoDB connected');
}

module.exports = connectDb;

