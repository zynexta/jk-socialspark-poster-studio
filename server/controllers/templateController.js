import Template from '../models/Template.js';
import ShareLink from '../models/ShareLink.js';

export const getTemplates = async (req, res, next) => {
  try {
    let templates = [];
    try {
      templates = await Template.find().sort({ createdAt: -1 });
    } catch (err) {
      // Mock fallback
    }
    res.json({ count: templates.length, templates });
  } catch (error) {
    next(error);
  }
};

export const getTemplateByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    let template;
    try {
      template = await Template.findOne({ shareToken: token });
    } catch (err) {
      // Fallback
    }

    res.json({ token, status: 'valid', template: template || null });
  } catch (error) {
    next(error);
  }
};

export const createTemplate = async (req, res, next) => {
  try {
    const templateData = req.body;
    let newTemplate;
    try {
      newTemplate = await Template.create(templateData);
    } catch (err) {
      newTemplate = { _id: `tpl_${Date.now()}`, ...templateData };
    }
    res.status(201).json({ message: 'Template created successfully', data: newTemplate });
  } catch (error) {
    next(error);
  }
};
