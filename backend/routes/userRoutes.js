const express = require('express');
const router = express.Router();
const { updateProfile, getUsers, updateUserRole } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/profile')
  .put(protect, updateProfile);

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id/role')
  .put(protect, admin, updateUserRole);

module.exports = router;
