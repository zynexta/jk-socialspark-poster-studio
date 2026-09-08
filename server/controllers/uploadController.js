import { uploadToCloudinary } from '../config/cloudinary.js';

export const uploadImage = async (req, res, next) => {
  try {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'No image data or file provided' });
    }

    try {
      const result = await uploadToCloudinary(image, folder || 'jk-socialspark/templates');
      return res.json({
        success: true,
        url: result.url,
        publicId: result.publicId,
      });
    } catch (cloudErr) {
      console.error('Cloudinary Controller Error:', cloudErr.message);
      return res.status(500).json({
        success: false,
        message: cloudErr.message || 'Failed to upload image asset to Cloudinary',
      });
    }
  } catch (error) {
    next(error);
  }
};
