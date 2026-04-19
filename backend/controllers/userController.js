const User = require('../models/User');

// PATCH /api/users/profile — authenticated users can only change currency & password
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only allow safe fields — role/name/email cannot be changed here
    if (req.body.currency) user.currency = req.body.currency;

    if (req.body.password) {
      if (req.body.password.length < 6)
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      user.password = req.body.password; // Mongoose pre-save hook handles hashing
    }

    const updated = await user.save();
    res.json({
      _id: updated._id, name: updated.name,
      email: updated.email, role: updated.role,
      currency: updated.currency
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// GET /api/users — Admin only, returns all users (no passwords)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// PUT /api/users/:id/role — Admin only, promote/demote user roles
exports.updateUserRole = async (req, res) => {
  const VALID_ROLES = ['Admin', 'Artisan', 'Designer'];
  const { role } = req.body;

  if (!role || !VALID_ROLES.includes(role))
    return res.status(400).json({ message: `Role must be one of: ${VALID_ROLES.join(', ')}` });

  // Prevent an admin from demoting themselves
  if (req.params.id === req.user._id.toString())
    return res.status(400).json({ message: 'You cannot change your own role' });

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating role' });
  }
};
