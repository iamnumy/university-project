import mongoose from 'mongoose';

// Single hardcoded seller for Phase 1. When multi-vendor lands, real sellers
// will own their own ObjectIds and this becomes the fallback for legacy rows.
export const DEFAULT_SELLER_ID = new mongoose.Types.ObjectId('6500000000000000000a0001');
export const DEFAULT_SELLER_NAME = 'Swabi Bazaar';
