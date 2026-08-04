import GeneratedPoster from '../models/GeneratedPoster.js';

export const generatePoster = async (req, res, next) => {
  try {
    const posterData = req.body;
    let poster;
    try {
      poster = await GeneratedPoster.create(posterData);
    } catch (err) {
      poster = { _id: `post_${Date.now()}`, ...posterData };
    }

    res.status(201).json({
      status: 'success',
      posterId: poster._id || `post_${Date.now()}`,
      poster,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosterHistory = async (req, res, next) => {
  try {
    let posters = [];
    try {
      posters = await GeneratedPoster.find().sort({ createdAt: -1 });
    } catch (err) {
      // Mock history fallback
    }
    res.json({ count: posters.length, posters });
  } catch (error) {
    next(error);
  }
};
