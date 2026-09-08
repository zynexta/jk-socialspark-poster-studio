import Category from '../models/Category.js';
import Template from '../models/Template.js';
import mongoose from 'mongoose';

const INITIAL_CATEGORIES = [
  { id: 'cat_sslc', name: 'SSLC / Academic', icon: 'GraduationCap', color: 'from-blue-600 to-indigo-600' },
  { id: 'cat_security', name: 'Security & CCTV', icon: 'ShieldCheck', color: 'from-cyan-600 to-blue-600' },
  { id: 'cat_sports', name: 'Sports & Awards', icon: 'Trophy', color: 'from-amber-500 to-orange-600' },
  { id: 'cat_offers', name: 'Offers & Discounts', icon: 'Tag', color: 'from-emerald-600 to-teal-600' },
  { id: 'cat_events', name: 'Events & Festivals', icon: 'Calendar', color: 'from-purple-600 to-pink-600' },
];

export const getCategories = async (req, res, next) => {
  try {
    let categories = [];
    if (mongoose.connection.readyState === 1) {
      categories = await Category.find().sort({ createdAt: 1 });

      // If empty, auto-seed default categories into MongoDB Atlas
      if (categories.length === 0) {
        for (const catData of INITIAL_CATEGORIES) {
          await Category.create(catData).catch(() => {});
        }
        categories = await Category.find().sort({ createdAt: 1 });
      }

      // Dynamically calculate actual template count per category from database
      const categoriesWithCount = await Promise.all(
        categories.map(async (cat) => {
          const count = await Template.countDocuments({
            category: { $regex: `^${cat.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
          });
          const obj = cat.toObject();
          return { ...obj, count };
        })
      );

      return res.json({ count: categoriesWithCount.length, categories: categoriesWithCount });
    }

    res.json({ count: 0, categories: [] });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, icon, color } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const catId = `cat_${slug}_${Date.now().toString(36)}`;

    const existing = await Category.findOne({
      name: { $regex: `^${cleanName}$`, $options: 'i' }
    });

    if (existing) {
      return res.status(400).json({ message: `Category '${cleanName}' already exists.` });
    }

    const newCategory = await Category.create({
      id: catId,
      name: cleanName,
      code: catId,
      icon: icon || 'Tag',
      color: color || 'from-blue-600 to-indigo-600',
    });

    console.log(`✅ Saved new category in MongoDB Atlas: ${newCategory.name} (${newCategory.id})`);
    res.status(201).json({ message: 'Category created successfully in MongoDB Atlas', category: newCategory });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Category ID is required for deletion.' });
    }

    let deleted = null;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        deleted = await Category.findByIdAndDelete(id);
      }
      if (!deleted) {
        deleted = await Category.findOneAndDelete({ $or: [{ id }, { code: id }, { name: id }] });
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Category not found in MongoDB Atlas.' });
    }

    console.log(`🗑️ Deleted category from MongoDB Atlas: ${deleted.name}`);
    res.json({ message: 'Category deleted successfully from MongoDB Atlas', id });
  } catch (error) {
    next(error);
  }
};
