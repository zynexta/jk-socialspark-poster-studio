import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: 'Tag' },
  count: { type: Number, default: 0 },
  color: { type: String, default: 'from-blue-600 to-indigo-600' }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
