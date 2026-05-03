import Product from '../models/Product.js';

export const listProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort, limit = 50, page = 1 } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortBy = sortMap[sort] || sortMap.newest;

    const lim = Math.min(Number(limit), 100);
    const skip = (Math.max(Number(page), 1) - 1) * lim;

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(lim),
      Product.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), limit: lim });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const listCategories = async (_req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories.sort());
  } catch (err) {
    next(err);
  }
};
