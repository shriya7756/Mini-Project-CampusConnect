const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		passwordHash: { type: String, required: true },
		year: { type: String },
		major: { type: String },
	},
	{ timestamps: true }
);

userSchema.methods.comparePassword = async function comparePassword(plainPassword) {
	return bcrypt.compare(plainPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

