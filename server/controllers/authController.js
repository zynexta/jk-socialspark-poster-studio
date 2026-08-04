import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const secret = process.env.JWT_SECRET || 'zynexta_smart_poster_super_secret_key_2026';

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    // Fallback search by role if admin email alias
    if (!user && (cleanEmail.includes('admin') || cleanEmail === 'admin@jksecurity.com' || cleanEmail === 'admin@zynexta.com')) {
      user = await User.findOne({ role: 'admin' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials! No admin account found.' });
    }

    // Verify password against bcrypt hash or raw password
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password! Please enter the valid admin password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    const userObj = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shopName: user.shopName || 'Zynexta Software Solutions',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };

    res.json({ user: userObj, token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found in MongoDB Atlas.' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, shopName, avatar, userId } = req.body;
    const targetId = req.user?.id || userId;

    let user;
    if (targetId) {
      user = await User.findById(targetId);
    }
    if (!user) {
      user = await User.findOne({ role: 'admin' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found in database.' });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (shopName) user.shopName = shopName;
    if (avatar) user.avatar = avatar;

    await user.save();

    const userObj = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shopName: user.shopName,
      avatar: user.avatar,
    };

    res.json({ message: 'Profile updated in MongoDB Atlas successfully!', user: userObj });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { newPassword, userId } = req.body;
    const targetId = req.user?.id || userId;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters long.' });
    }

    let user;
    if (targetId) {
      user = await User.findById(targetId);
    }
    if (!user) {
      user = await User.findOne({ role: 'admin' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found in database.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Admin password updated in MongoDB Atlas successfully!' });
  } catch (error) {
    next(error);
  }
};
