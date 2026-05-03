import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  adminListProducts,
  adminGetProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminListOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  adminStats,
} from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', adminStats);

router.get('/products', adminListProducts);
router.post('/products', adminCreateProduct);
router.get('/products/:id', adminGetProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

router.get('/orders', adminListOrders);
router.get('/orders/:id', adminGetOrder);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

export default router;
