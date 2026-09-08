import GeneratedPoster from '../models/GeneratedPoster.js';
import Template from '../models/Template.js';
import Category from '../models/Category.js';
import ShareLink from '../models/ShareLink.js';
import mongoose from 'mongoose';

export const getAnalytics = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        totalGeneratedPosters: 0,
        totalTemplates: 0,
        totalCategories: 0,
        totalShareLinks: 0,
        monthlyTrends: [],
        categoryPerformance: [],
        templateUsage: [],
        recentActivity: [],
      });
    }

    // 1. Total Counters
    const totalGeneratedPosters = await GeneratedPoster.countDocuments();
    const totalTemplates = await Template.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalShareLinks = await ShareLink.countDocuments();

    // 2. Monthly Generation Trends (Aggregated from real GeneratedPoster createdAt timestamps)
    const monthlyAgg = await GeneratedPoster.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let maxMonthlyCount = 0;
    monthlyAgg.forEach(item => {
      if (item.count > maxMonthlyCount) maxMonthlyCount = item.count;
    });

    const monthlyTrends = monthlyAgg.map(item => {
      const mName = monthNames[item._id.month - 1] || 'Month';
      const label = `${mName} ${item._id.year}`;
      const pct = maxMonthlyCount > 0 ? Math.round((item.count / maxMonthlyCount) * 100) : 0;
      return {
        month: label,
        count: item.count,
        pct: pct
      };
    });

    // 3. Category Performance (Aggregated from actual generated posters + template categories)
    const templates = await Template.find().select('id shareToken title category');
    const templateCategoryMap = new Map();
    templates.forEach(t => {
      if (t.id) templateCategoryMap.set(t.id, t.category);
      if (t.shareToken) templateCategoryMap.set(t.shareToken, t.category);
    });

    const allPosters = await GeneratedPoster.find().select('templateId templateTitle createdAt');
    const categoryCounts = new Map();

    allPosters.forEach(p => {
      let cat = templateCategoryMap.get(p.templateId) || 'General';
      categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
    });

    const categoryColors = ['bg-[#C1121F]', 'bg-[#111111]', 'bg-[#555555]', 'bg-[#8B0E16]', 'bg-[#E5E5E5]'];
    let categoryPerformance = [];
    let colorIdx = 0;

    categoryCounts.forEach((count, catName) => {
      const percentage = totalGeneratedPosters > 0 ? Math.round((count / totalGeneratedPosters) * 100) : 0;
      categoryPerformance.push({
        category: catName,
        count: count,
        percentage: percentage,
        color: categoryColors[colorIdx % categoryColors.length]
      });
      colorIdx++;
    });

    categoryPerformance.sort((a, b) => b.count - a.count);

    // 4. Template Usage Stats
    const templateUsage = templates.map(t => {
      const genCount = allPosters.filter(p => p.templateId === t.id || p.templateId === t.shareToken).length;
      return {
        id: t.id,
        title: t.title,
        category: t.category,
        count: genCount
      };
    }).sort((a, b) => b.count - a.count);

    // 5. Recent Activity Feed
    const recentPosters = await GeneratedPoster.find().sort({ createdAt: -1 }).limit(5);
    const recentShareLinks = await ShareLink.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalGeneratedPosters,
      totalTemplates,
      totalCategories,
      totalShareLinks,
      monthlyTrends,
      categoryPerformance,
      templateUsage,
      recentActivity: {
        posters: recentPosters,
        shareLinks: recentShareLinks
      }
    });
  } catch (error) {
    console.error('Analytics calculation error:', error);
    next(error);
  }
};
