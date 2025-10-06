const jwt = require('jsonwebtoken');

function auth(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ')
		? authHeader.substring('Bearer '.length)
		: null;

	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	try {
		const secret = process.env.JWT_SECRET || 'changeme';
		const decoded = jwt.verify(token, secret);
		req.user = decoded;
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

module.exports = auth;

