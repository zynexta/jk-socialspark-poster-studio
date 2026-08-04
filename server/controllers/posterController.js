import GeneratedPoster from '../models/GeneratedPoster.js';
import Template from '../models/Template.js';
import mongoose from 'mongoose';

export const generatePoster = async (req, res, next) => {
  try {
    const posterData = req.body;
    let poster = posterData;

    if (mongoose.connection.readyState === 1) {
      poster = await GeneratedPoster.create(posterData);

      // Increment generatedCount on matching template in MongoDB Atlas
      if (posterData.templateId) {
        await Template.findOneAndUpdate(
          { $or: [{ id: posterData.templateId }, { _id: mongoose.Types.ObjectId.isValid(posterData.templateId) ? posterData.templateId : null }] },
          { $inc: { generatedCount: 1 } }
        ).catch(() => {});
      }
      console.log(`✅ Recorded generated poster in MongoDB Atlas for: ${posterData.customerName || 'Guest'}`);
    }

    res.status(201).json({
      status: 'success',
      posterId: poster._id || `post_${Date.now()}`,
      poster,
    });
  } catch (error) {
    console.error('Error generating poster log in MongoDB Atlas:', error);
    next(error);
  }
};

export const getPosterHistory = async (req, res, next) => {
  try {
    let posters = [];
    if (mongoose.connection.readyState === 1) {
      posters = await GeneratedPoster.find().sort({ createdAt: -1 });
    }
    res.json({ count: posters.length, posters });
  } catch (error) {
    next(error);
  }
};
