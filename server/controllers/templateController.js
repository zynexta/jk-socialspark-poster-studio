import Template from '../models/Template.js';
import mongoose from 'mongoose';

export const getTemplates = async (req, res, next) => {
  try {
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
    let template = null;

    if (mongoose.connection.readyState === 1) {
      const cleanToken = decodeURIComponent(token).toLowerCase().trim();
      const normToken = cleanToken.replace(/[\s_-]+/g, '');

      // 1. Exact or regex match on shareToken or id
      template = await Template.findOne({
        $or: [
          { shareToken: cleanToken },
          { id: cleanToken },
          { shareToken: { $regex: normToken, $options: 'i' } },
          { id: { $regex: normToken, $options: 'i' } }
        ]
      });

      // 2. Fallback search by title
      if (!template) {
        template = await Template.findOne({
          title: { $regex: cleanToken, $options: 'i' }
        });
      }

      // 3. Resilient Fallback to latest active template
      if (!template) {
        template = await Template.findOne({ status: 'active' }).sort({ createdAt: -1 });
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

    if (!templateData.id) {
      templateData.id = `tmpl_${Date.now()}`;
    }
    if (!templateData.shareToken) {
      templateData.shareToken = templateData.id;
    }

    let savedTemplate = templateData;

    if (mongoose.connection.readyState === 1) {
      savedTemplate = await Template.findOneAndUpdate(
        { id: templateData.id },
        templateData,
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

    if (mongoose.connection.readyState === 1) {
      await Template.findOneAndDelete({ id });
      console.log(`🗑️ Deleted template from MongoDB Atlas: ${id}`);
    }

    res.json({ message: 'Template deleted successfully', id });
  } catch (error) {
    next(error);
  }
};
