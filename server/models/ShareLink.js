import mongoose from 'mongoose';

const shareLinkSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  token: { type: String, required: true, unique: true },
  expirationDate: Date,
  isPublic: { type: Boolean, default: true },
  clickCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ShareLink', shareLinkSchema);
