import mongoose from 'mongoose';

const shareLinkSchema = new mongoose.Schema({
  templateId: { type: String, required: true },
  templateTitle: { type: String },
  token: { type: String, required: true, unique: true },
  shopOwnerId: { type: String },
  shopOwnerName: { type: String },
  expirationDate: { type: String },
  isPublic: { type: Boolean, default: true },
  clickCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ShareLink', shareLinkSchema);
