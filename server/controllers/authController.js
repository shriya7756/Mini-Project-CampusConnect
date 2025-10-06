const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

async function signup(req, res) {
	try {
		const { name, email, password, year, major } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: 'Email already in use' });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash, year, major });

		const token = generateToken({ userId: user._id, email: user.email });
		return res.status(201).json({
			user: { id: user._id, name: user.name, email: user.email, year: user.year, major: user.major },
			token,
		});
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
}

async function login(req, res) {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'Missing email or password' });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const valid = await user.comparePassword(password);
		if (!valid) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const token = generateToken({ userId: user._id, email: user.email });
		return res.json({
			user: { id: user._id, name: user.name, email: user.email, year: user.year, major: user.major },
			token,
		});
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
}

module.exports = { signup, login };

