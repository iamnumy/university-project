import mongoose from 'mongoose';
import { DEFAULT_SELLER_ID } from '../config/constants.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: { type: String, required: true, trim: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, default: DEFAULT_SELLER_ID, index: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);
