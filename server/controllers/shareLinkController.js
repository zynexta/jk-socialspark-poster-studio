import ShareLink from '../models/ShareLink.js';
import Template from '../models/Template.js';
import mongoose from 'mongoose';

export const createShareLink = async (req, res, next) => {
  try {
    const { templateId, templateTitle, token, shopOwnerId, shopOwnerName, expirationDate, isPublic } = req.body;

    if (!token || !templateId) {
      return res.status(400).json({ message: 'Template ID and Token are required to generate share link.' });
    }

    const cleanToken = token.toLowerCase().trim().replace(/\/+$/, '');

    let shareLinkDoc = null;
    if (mongoose.connection.readyState === 1) {
      shareLinkDoc = await ShareLink.findOneAndUpdate(
        { token: cleanToken },
        {
          $set: {
            templateId,
            templateTitle: templateTitle || 'Poster Template',
            token: cleanToken,
            shopOwnerId: shopOwnerId || 'usr_admin',
            shopOwnerName: shopOwnerName || 'Admin / Shop Owner',
            expirationDate: expirationDate || '2026-12-31',
            isPublic: isPublic !== undefined ? isPublic : true,
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ Saved Share Link in MongoDB Atlas: ${cleanToken}`);
    } else {
      shareLinkDoc = {
        _id: `sl_${Date.now()}`,
        templateId,
        templateTitle,
        token: cleanToken,
        shopOwnerName: shopOwnerName || 'Admin',
        createdAt: new Date()
      };
    }

    res.status(201).json({ message: 'Share link created successfully in MongoDB Atlas', shareLink: shareLinkDoc });
  } catch (error) {
    next(error);
  }
};

export const getShareLinks = async (req, res, next) => {
  try {
    let shareLinks = [];
    if (mongoose.connection.readyState === 1) {
      shareLinks = await ShareLink.find().sort({ createdAt: -1 });
    }
    res.json({ count: shareLinks.length, shareLinks });
  } catch (error) {
    next(error);
  }
};

export const getShareLinkByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: 'Token parameter is required.' });
    }

    const cleanToken = decodeURIComponent(token).toLowerCase().trim();

    let shareLink = null;
    if (mongoose.connection.readyState === 1) {
      shareLink = await ShareLink.findOneAndUpdate(
        { token: cleanToken },
        { $inc: { clickCount: 1 } },
        { new: true }
      );
    }

    if (!shareLink) {
      return res.status(404).json({ message: 'Share link not found.' });
    }

    res.json({ shareLink });
  } catch (error) {
    next(error);
  }
};
