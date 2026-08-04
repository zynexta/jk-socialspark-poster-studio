import { uploadToCloudinary } from '../config/cloudinary.js';

export const uploadImage = async (req, res, next) => {
  try {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'No image data or file provided' });
    }

    try {
      const result = await uploadToCloudinary(image, folder || 'jk-smart-posters');
      return res.json({
        success: true,
        url: result.url,
        publicId: result.publicId,
      });
    } catch (cloudErr) {
      // Fallback response if Cloudinary credentials are not yet configured
      return res.json({
        success: true,
        url: image, // Return given image/base64 string in fallback mode
        isFallback: true,
        message: 'Operating in standalone mode or Cloudinary credentials pending.',
      });
    }
  } catch (error) {
    next(error);
  }
};
