const express = require('express');
const auth = require('../middleware/auth');
const { getMe, updateProfile, changePassword } = require('../controllers/userController');

const router = express.Router();

router.get('/me', auth, getMe);
router.put('/me', auth, updateProfile);
router.post('/me/password', auth, changePassword);

module.exports = router;
