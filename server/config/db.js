import mongoose from 'mongoose';

/**
 * Connect to MongoDB / MongoDB Atlas Database
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/jk_poster_generator';
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ Connected to MongoDB Database: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`ℹ️ MongoDB Connection Info: ${error.message}`);
    console.warn('⚠️ Server will continue operating with fallback standalone mode.');
  }
};
