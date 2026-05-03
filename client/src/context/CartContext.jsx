import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CART_KEY = 'swabi_cart';
const SHIPPING_FEE = 200;
const FREE_SHIPPING_THRESHOLD = 5000;

const lineKey = (item) => `${item.productId}|${item.size || ''}|${item.color || ''}`;

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart());

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      const k = lineKey(item);
      const existing = prev.find((p) => lineKey(p) === k);
      if (existing) {
        return prev.map((p) =>
          lineKey(p) === k ? { ...p, qty: Math.min(p.qty + (item.qty || 1), 99) } : p
        );
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  };

  const updateQty = (key, qty) => {
    const q = Math.max(1, Math.min(Number(qty) || 1, 99));
    setItems((prev) => prev.map((p) => (lineKey(p) === key ? { ...p, qty: q } : p)));
  };

  const removeItem = (key) => {
    setItems((prev) => prev.filter((p) => lineKey(p) !== key));
  };

  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shippingFee = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shippingFee;
    const count = items.reduce((s, i) => s + i.qty, 0);
    return { subtotal, shippingFee, total, count };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, totals, lineKey }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE };
