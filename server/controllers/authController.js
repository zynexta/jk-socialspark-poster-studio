import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const secret = process.env.JWT_SECRET || 'jk_socialspark_super_secret_key_2026';

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if MongoDB is connected, attempt reconnect if needed
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ MongoDB Atlas is not in connected state. Triggering connection...');
      connectDB().catch(() => {});
      return res.status(503).json({ message: 'MongoDB Atlas connection buffering timed out. Please try again.' });
    }

    // STRICT EMAIL LOOKUP IN MONGODB ATLAS
    const user = await User.findOne({ email: cleanEmail }).maxTimeMS(5000);

    if (!user) {
      return res.status(401).json({ message: `Invalid Email address! No admin account registered under '${cleanEmail}'.` });
    }

    // Verify password against bcrypt hash or raw password
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password! Please enter the valid Admin password.' });
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
      shopName: user.shopName || 'JK SocialSpark',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };

    res.json({ user: userObj, token });
  } catch (error) {
    if (error.name === 'MongooseError' || error.message?.includes('buffering timed out')) {
      return res.status(503).json({ message: 'MongoDB Atlas connection buffering timed out.' });
    }
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'MongoDB Atlas connection offline.' });
    }
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
    const { name, email, shopName, avatar } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'MongoDB Atlas connection offline.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    if (name && typeof name === 'string') user.name = name.trim();
    if (email && typeof email === 'string') user.email = email.toLowerCase().trim();
    if (shopName && typeof shopName === 'string') user.shopName = shopName.trim();
    if (avatar && typeof avatar === 'string') user.avatar = avatar.trim();

    await user.save();

    const userObj = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shopName: user.shopName || 'JK SocialSpark',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };

    console.log(`✅ Admin Profile updated: ${userObj.email}`);
    res.json({ message: 'Profile updated successfully!', user: userObj });
  } catch (error) {
    console.error('Error updating profile in MongoDB Atlas:', error);
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'MongoDB Atlas connection offline.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log(`✅ Admin password updated successfully for user ID: ${userId}`);
    res.json({ message: 'Admin password updated successfully!' });
  } catch (error) {
    console.error('Error updating password:', error);
    next(error);
  }
};
