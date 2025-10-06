const jwt = require('jsonwebtoken');

function generateToken(payload, options = {}) {
	const secret = process.env.JWT_SECRET || 'changeme';
	const expiresIn = options.expiresIn || '7d';
	return jwt.sign(payload, secret, { expiresIn });
}

module.exports = generateToken;

