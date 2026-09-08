import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper utility to upload a base64 or file buffer to Cloudinary
 * @param {string} fileStr - Base64 string or file path
 * @param {string} folder - Destination folder in Cloudinary
 */
export const uploadToCloudinary = async (fileStr, folder = 'jk-socialspark/templates') => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder,
      resource_type: 'auto',
    });
    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default cloudinary;
