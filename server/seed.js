import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';
import { sampleProducts } from './data/products.js';

dotenv.config();

const run = async () => {
  await connectDB();
  const mode = process.argv[2] || '--reset';

  if (mode === '--reset') {
    await Product.deleteMany({});
    console.log('Cleared products collection');
  }

  const result = await Product.insertMany(sampleProducts, { ordered: false });
  console.log(`Inserted ${result.length} products`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
