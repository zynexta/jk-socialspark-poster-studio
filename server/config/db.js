import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/**
 * Connect to MongoDB / MongoDB Atlas Database & Auto-Seed Admin
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/jk_poster_generator';
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ Connected to MongoDB Database: ${conn.connection.host}`);

    // Seed Super Admin if no admin exists in MongoDB Atlas
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'JK SocialSpark Admin',
        email: 'admin@jksocialspark.com',
        password: hashedPassword,
        role: 'admin',
        shopName: 'JK SocialSpark',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      });
      console.log('🎉 Default Admin created in MongoDB Atlas: admin@jksocialspark.com (pass: admin123)');
    }

    return conn;
  } catch (error) {
    console.warn(`ℹ️ MongoDB Connection Info: ${error.message}`);
    console.warn('⚠️ Server will continue operating with fallback standalone mode.');
  }
};
