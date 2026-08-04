import mongoose from 'mongoose';

const generatedPosterSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  templateTitle: String,
  generatedBy: String,
  shopOwnerId: String,
  customerName: String,
  previewUrl: String,
  fieldsData: mongoose.Schema.Types.Mixed,
  downloads: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model('GeneratedPoster', generatedPosterSchema);
