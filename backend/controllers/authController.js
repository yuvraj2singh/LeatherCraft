const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = (email || '').toLowerCase().trim();
  const VALID_ROLES = ['Admin', 'Artisan', 'Designer'];

  // Basic validation
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });
  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
    return res.status(400).json({ message: 'Please provide a valid email address' });

  try {
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Allow selecting Admin only for initial bootstrap when no admin exists yet.
    const requestedRole = VALID_ROLES.includes(role) ? role : 'Artisan';
    const adminExists = await User.exists({ role: 'Admin' });
    const finalRole = (requestedRole === 'Admin' && !adminExists) ? 'Admin' : requestedRole;

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: finalRole
    });

    if (user) {
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, currency: user.currency,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const normalizedEmail = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
    return res.status(400).json({ message: 'Please provide a valid email address' });

  try {
    // Normalise email to prevent case-sensitivity bypass
    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, currency: user.currency,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};
