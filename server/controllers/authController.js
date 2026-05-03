import User from '../models/User.js';
import { signToken } from '../utils/token.js';

const validEmail = (s) => typeof s === 'string' && /.+@.+\..+/.test(s);

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!validEmail(email)) return res.status(400).json({ message: 'Invalid email' });
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name: name.trim(), email, password });
    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!validEmail(email) || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user._id);
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
};
