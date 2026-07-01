const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const buildUserPayload = (user) => ({
  id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  profilePhoto: user.profilePhoto,
  role: user.role,
  status: user.status,
  school: user.school,
  department: user.department,
  graduationYear: user.graduationYear
});

const signTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id }, config.jwt.accessTokenSecret, {
    expiresIn: config.jwt.accessTokenExpire
  });
  const refreshToken = jwt.sign({ id: user._id }, config.jwt.refreshTokenSecret, {
    expiresIn: config.jwt.refreshTokenExpire
  });
  return { accessToken, refreshToken };
};

// Register
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, graduationYear, school, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const isAdminRegistration = process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && email === process.env.ADMIN_EMAIL;
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      graduationYear,
      school,
      department,
      role: isAdminRegistration ? 'admin' : 'user',
      status: isAdminRegistration ? 'approved' : 'pending'
    });

    await user.save();

    if (user.status === 'pending') {
      return res.status(201).json({
        message: 'Registration submitted. An admin must approve your account before you can sign in.',
        requiresApproval: true,
        user: buildUserPayload(user)
      });
    }

    const tokens = signTokens(user);
    res.status(201).json({
      message: 'User registered successfully',
      user: buildUserPayload(user),
      ...tokens
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'Your account is pending approval by an admin.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const tokens = signTokens(user);
    res.json({
      message: 'Login successful',
      user: buildUserPayload(user),
      ...tokens
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Google OAuth Callback (simplified)
const googleCallback = async (req, res) => {
  try {
    const { email, firstName, lastName, picture, googleId } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        firstName: firstName || 'User',
        lastName: lastName || '',
        email,
        googleId,
        profilePhoto: picture,
        isEmailVerified: true,
        role: 'user',
        status: 'approved'
      });
      await user.save();
    }

    const tokens = signTokens(user);
    res.json({
      message: 'Google login successful',
      user: buildUserPayload(user),
      ...tokens
    });
  } catch (error) {
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
};

// Refresh Token
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshTokenSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAccessToken = jwt.sign({ id: user._id }, config.jwt.accessTokenSecret, {
      expiresIn: config.jwt.accessTokenExpire
    });

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Token refresh failed', error: error.message });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(users.map(buildUserPayload));
  } catch (error) {
    res.status(500).json({ message: 'Could not load pending users', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(buildUserPayload));
  } catch (error) {
    res.status(500).json({ message: 'Could not load users', error: error.message });
  }
};

const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = 'approved';
    await user.save();
    res.json({ message: 'User approved', user: buildUserPayload(user) });
  } catch (error) {
    res.status(500).json({ message: 'Could not approve user', error: error.message });
  }
};

const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = 'rejected';
    await user.save();
    res.json({ message: 'User rejected', user: buildUserPayload(user) });
  } catch (error) {
    res.status(500).json({ message: 'Could not reject user', error: error.message });
  }
};

// Logout
const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  register,
  login,
  googleCallback,
  refreshAccessToken,
  getPendingUsers,
  getAllUsers,
  approveUser,
  rejectUser,
  logout
};
