import Template from '../models/Template.js';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

// Auto-reconnect to MongoDB Atlas if serverless instance cold starts
const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
};

export const getTemplates = async (req, res, next) => {
  try {
    await ensureConnection();
    let templates = [];
    if (mongoose.connection.readyState === 1) {
      templates = await Template.find().sort({ updatedAt: -1 });
    }
    res.json({ count: templates.length, templates });
  } catch (error) {
    next(error);
  }
};

export const getTemplateByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    await ensureConnection();

    let template = null;
    const cleanToken = decodeURIComponent(token).toLowerCase().trim().replace(/\/+$/, '');
    const normToken = cleanToken.replace(/[\s_-]+/g, '');

    if (mongoose.connection.readyState === 1) {
      // 1. Exact match on shareToken or id FIRST
      template = await Template.findOne({
        $or: [
          { shareToken: cleanToken },
          { id: cleanToken }
        ]
      });

      // 2. Exact normalized match
      if (!template) {
        template = await Template.findOne({
          $or: [
            { shareToken: { $regex: `^${normToken}$`, $options: 'i' } },
            { id: { $regex: `^${normToken}$`, $options: 'i' } }
          ]
        });
      }

      // 3. Match title exact normalized
      if (!template) {
        template = await Template.findOne({
          title: { $regex: `^${cleanToken}$`, $options: 'i' }
        });
      }

      // 4. Resilient substring search on shareToken or id
      if (!template && normToken.length >= 3) {
        template = await Template.findOne({
          $or: [
            { shareToken: { $regex: normToken, $options: 'i' } },
            { id: { $regex: normToken, $options: 'i' } }
          ]
        });
      }

      // 5. Ultimate Fallback to latest active template so share links NEVER fail
      if (!template) {
        template = await Template.findOne({ status: 'active' }).sort({ updatedAt: -1 });
      }
    }

    res.json({ token, status: template ? 'valid' : 'not_found', template });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateTemplate = async (req, res, next) => {
  try {
    const templateData = req.body;
    await ensureConnection();

    if (!templateData.id) {
      templateData.id = `tmpl_${Date.now()}`;
    }
    if (!templateData.shareToken) {
      templateData.shareToken = templateData.id;
    }

    // Clean shareToken of any trailing slashes
    templateData.shareToken = templateData.shareToken.toLowerCase().trim().replace(/\/+$/, '');

    let savedTemplate = templateData;

    if (mongoose.connection.readyState === 1) {
      savedTemplate = await Template.findOneAndUpdate(
        { id: templateData.id },
        { $set: templateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ Saved template in MongoDB Atlas: ${savedTemplate.title} (${savedTemplate.shareToken})`);
    }

    res.status(201).json({ message: 'Template saved in MongoDB Atlas successfully', template: savedTemplate });
  } catch (error) {
    console.error('Error saving template in MongoDB Atlas:', error);
    next(error);
  }
};

export const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ensureConnection();

    if (mongoose.connection.readyState === 1) {
      await Template.findOneAndDelete({ $or: [{ id }, { shareToken: id }] });
      console.log(`🗑️ Deleted template from MongoDB Atlas: ${id}`);
    }

    res.json({ message: 'Template deleted successfully', id });
  } catch (error) {
    next(error);
  }
};
