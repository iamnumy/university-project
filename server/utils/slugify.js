import Product from '../models/Product.js';

const baseSlug = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const slugify = (s) => baseSlug(s);

export const ensureUniqueProductSlug = async (name, ignoreId = null) => {
  const base = baseSlug(name) || 'product';
  let candidate = base;
  let n = 1;

  while (true) {
    const query = { slug: candidate };
    if (ignoreId) query._id = { $ne: ignoreId };
    const exists = await Product.findOne(query).lean();
    if (!exists) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
};
