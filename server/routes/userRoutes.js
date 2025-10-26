const express = require('express');
const auth = require('../middleware/auth');
const { getMe, updateProfile, changePassword, getActivity } = require('../controllers/userController');

const router = express.Router();

router.get('/me', auth, getMe);
router.put('/me', auth, updateProfile);
router.post('/me/password', auth, changePassword);
router.get('/me/activity', auth, getActivity);

module.exports = router;
