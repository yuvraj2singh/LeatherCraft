const express = require('express');
const router = express.Router();
const { updateProfile, getUsers } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/profile')
  .put(protect, updateProfile);

router.route('/')
  .get(protect, admin, getUsers);

module.exports = router;
