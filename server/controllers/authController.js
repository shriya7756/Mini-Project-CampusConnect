const bcrypt = require('bcrypt');
const crypto = require('crypto');
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

async function forgotPassword(req, res) {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ message: 'Email is required' });
		}

		const user = await User.findOne({ email });
		if (!user) {
			// Don't reveal if email exists or not for security
			return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString('hex');
		const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

		// Save reset token to user
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiry = resetTokenExpiry;
		await user.save();

		// In a real app, you would send an email here
		// For now, we'll just log the reset token (for development)
		console.log(`Password reset token for ${email}: ${resetToken}`);
		console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

		return res.json({ 
			message: 'If an account with that email exists, a reset link has been sent.',
			// In development, include the token so you can test
			...(process.env.NODE_ENV === 'development' && { resetToken })
		});
	} catch (err) {
		console.error('Forgot password error:', err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function resetPassword(req, res) {
	try {
		const { token, newPassword } = req.body;
		if (!token || !newPassword) {
			return res.status(400).json({ message: 'Token and new password are required' });
		}

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiry: { $gt: new Date() }
		});

		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired reset token' });
		}

		// Hash new password
		const passwordHash = await bcrypt.hash(newPassword, 10);
		
		// Update user password and clear reset token
		user.passwordHash = passwordHash;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiry = undefined;
		await user.save();

		return res.json({ message: 'Password has been reset successfully' });
	} catch (err) {
		console.error('Reset password error:', err);
		return res.status(500).json({ message: 'Server error' });
	}
}

module.exports = { signup, login, forgotPassword, resetPassword };

