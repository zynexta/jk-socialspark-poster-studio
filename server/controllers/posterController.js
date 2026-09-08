import GeneratedPoster from '../models/GeneratedPoster.js';
import Template from '../models/Template.js';
import mongoose from 'mongoose';

export const generatePoster = async (req, res, next) => {
  try {
    const posterData = req.body;
    
    if (!posterData.customerName && !posterData.templateTitle && !posterData.templateId) {
      return res.status(400).json({ message: 'Missing required poster generation details.' });
    }

    let createdPoster = null;

    if (mongoose.connection.readyState === 1) {
      createdPoster = await GeneratedPoster.create({
        templateId: posterData.templateId || null,
        templateTitle: posterData.templateTitle || 'Custom Poster',
        generatedBy: posterData.generatedBy || 'Shop Owner',
        shopOwnerId: posterData.shopOwnerId || 'usr_shop_01',
        customerName: posterData.customerName || 'Customer',
        previewUrl: posterData.previewUrl || '',
        fieldsData: posterData.fieldsData || {},
        downloads: 1,
      });

      // Increment generatedCount on matching template in MongoDB Atlas
      if (posterData.templateId) {
        await Template.findOneAndUpdate(
          { $or: [{ id: posterData.templateId }, { shareToken: posterData.templateId }] },
          { $inc: { generatedCount: 1 } }
        ).catch(() => {});
      }

      console.log(`✅ Saved Generated Poster in MongoDB Atlas for: ${createdPoster.customerName}`);
    } else {
      createdPoster = {
        _id: `gen_${Date.now()}`,
        createdAt: new Date(),
        ...posterData,
      };
    }

    res.status(201).json({
      status: 'success',
      message: 'Poster generation logged in MongoDB Atlas',
      posterId: createdPoster._id,
      poster: createdPoster,
    });
  } catch (error) {
    console.error('Error recording generated poster in MongoDB Atlas:', error);
    next(error);
  }
};

export const getPosterHistory = async (req, res, next) => {
  try {
    let posters = [];
    if (mongoose.connection.readyState === 1) {
      posters = await GeneratedPoster.find().sort({ createdAt: -1 });
    }
    
    // Normalize format for frontend consumption
    const formatted = posters.map((p) => {
      const obj = p.toObject ? p.toObject() : p;
      return {
        id: obj._id ? obj._id.toString() : obj.id,
        _id: obj._id ? obj._id.toString() : obj.id,
        templateId: obj.templateId,
        templateTitle: obj.templateTitle || 'Custom Poster',
        generatedBy: obj.generatedBy || 'Shop Owner',
        shopOwnerId: obj.shopOwnerId || 'usr_shop',
        customerName: obj.customerName || 'Customer',
        previewUrl: obj.previewUrl || '',
        fieldsData: obj.fieldsData || {},
        date: obj.createdAt ? new Date(obj.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : new Date().toLocaleDateString(),
        createdAt: obj.createdAt || new Date(),
      };
    });

    res.json({ count: formatted.length, posters: formatted });
  } catch (error) {
    next(error);
  }
};
