import { Router } from 'express';
import { createOrder, myOrders, getOrderById } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', createOrder);
router.get('/me', myOrders);
router.get('/:id', getOrderById);

export default router;
