import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { ensureUniqueProductSlug } from '../utils/slugify.js';

// ---------- Products ----------

export const adminListProducts = async (req, res, next) => {
  try {
    const { search, limit = 100, page = 1 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    const lim = Math.min(Number(limit), 200);
    const skip = (Math.max(Number(page), 1) - 1) * lim;
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim),
      Product.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), limit: lim });
  } catch (err) {
    next(err);
  }
};

export const adminGetProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const sanitizeImagesList = (val) => {
  if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
  if (typeof val === 'string') {
    return val
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const sanitizeStringList = (val) => sanitizeImagesList(val);

const buildProductPayload = async (body, existing = null) => {
  const name = body.name?.trim();
  if (!name) throw Object.assign(new Error('Name is required'), { status: 400 });
  if (body.price == null || isNaN(Number(body.price)) || Number(body.price) < 0) {
    throw Object.assign(new Error('Price must be >= 0'), { status: 400 });
  }
  if (!body.category?.trim()) {
    throw Object.assign(new Error('Category is required'), { status: 400 });
  }

  const slug = await ensureUniqueProductSlug(body.slug?.trim() || name, existing?._id);

  return {
    name,
    slug,
    description: body.description?.trim() || '',
    price: Number(body.price),
    compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
    category: body.category.trim(),
    sizes: sanitizeStringList(body.sizes),
    colors: sanitizeStringList(body.colors),
    images: sanitizeImagesList(body.images),
    stock: Math.max(0, Number(body.stock) || 0),
    isActive: body.isActive !== false,
  };
};

export const adminCreateProduct = async (req, res, next) => {
  try {
    const payload = await buildProductPayload(req.body);
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const adminUpdateProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    const payload = await buildProductPayload(req.body, existing);
    Object.assign(existing, payload);
    await existing.save();
    res.json(existing);
  } catch (err) {
    next(err);
  }
};

export const adminDeleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// ---------- Orders ----------

const ORDER_STATUSES = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export const adminListOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (status && ORDER_STATUSES.includes(status)) filter.orderStatus = status;
    const lim = Math.min(Number(limit), 200);
    const skip = (Math.max(Number(page), 1) - 1) * lim;
    const [items, total] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim),
      Order.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), limit: lim });
  } catch (err) {
    next(err);
  }
};

export const adminGetOrder = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) {
      if (!ORDER_STATUSES.includes(orderStatus)) {
        return res.status(400).json({ message: 'Invalid order status' });
      }
      order.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' });
      }
      order.paymentStatus = paymentStatus;
    }
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// ---------- Stats ----------

export const adminStats = async (_req, res, next) => {
  try {
    const [productCount, orderCount, customerCount, revenueAgg, recent] = await Promise.all([
      Product.countDocuments({}),
      Order.countDocuments({}),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 }).limit(5),
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    const statusAgg = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);
    const byStatus = ORDER_STATUSES.reduce((acc, s) => {
      acc[s] = statusAgg.find((x) => x._id === s)?.count || 0;
      return acc;
    }, {});

    res.json({
      productCount,
      orderCount,
      customerCount,
      revenue,
      byStatus,
      recentOrders: recent,
    });
  } catch (err) {
    next(err);
  }
};
