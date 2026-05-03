import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const SHIPPING_FEE = 200; // PKR flat fee. Free over Rs 5000.
const FREE_SHIPPING_THRESHOLD = 5000;

const validateAddress = (a) => {
  if (!a) return 'Shipping address is required';
  for (const f of ['fullName', 'phone', 'line1', 'city']) {
    if (!a[f] || !String(a[f]).trim()) return `Address field "${f}" is required`;
  }
  return null;
};

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    const addrError = validateAddress(shippingAddress);
    if (addrError) return res.status(400).json({ message: addrError });
    if (!['cod', 'card_simulated'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const ids = items.map((i) => i.productId).filter(Boolean);
    if (ids.some((id) => !mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid product id in cart' });
    }
    const products = await Product.find({ _id: { $in: ids }, isActive: true });
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    for (const line of items) {
      const product = byId.get(String(line.productId));
      if (!product) {
        return res.status(400).json({ message: `Product no longer available` });
      }
      const qty = Math.max(1, Math.min(Number(line.qty) || 1, 99));
      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        slug: product.slug,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        size: line.size || '',
        color: line.color || '',
        qty,
      });
    }

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shippingFee;

    const paymentStatus = paymentMethod === 'card_simulated' ? 'paid' : 'pending';

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus: 'placed',
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.userId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not your order' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};
