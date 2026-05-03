import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  apiAdminGetOrder,
  apiAdminUpdateOrderStatus,
} from '../../api/client.js';
import { formatPKR } from '../../utils/format.js';
import Loader from '../../components/Loader.jsx';
import ErrorBox from '../../components/ErrorBox.jsx';

const ORDER_STATUSES = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiAdminGetOrder(id)
      .then((o) => {
        setOrder(o);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setStatus('error');
      });
  }, [id]);

  const updateField = async (field, value) => {
    setSaving(true);
    try {
      const updated = await apiAdminUpdateOrderStatus(id, { [field]: value });
      setOrder(updated);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') return <Loader />;
  if (status === 'error') return <ErrorBox message={error} />;
  if (!order) return null;

  return (
    <div>
      <Link to="/admin/orders" className="text-sm text-stone-500 hover:text-stone-900">
        ← Back to orders
      </Link>
      <h1 className="text-2xl font-semibold mt-2 mb-1">
        Order <span className="font-mono">#{order._id.slice(-8).toUpperCase()}</span>
      </h1>
      <p className="text-sm text-stone-500 mb-6">
        Placed {new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
      </p>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          <section className="bg-white border border-stone-200 rounded-lg p-5">
            <h2 className="font-semibold mb-3">Items</h2>
            <ul className="divide-y divide-stone-100">
              {order.items.map((i, idx) => (
                <li key={idx} className="py-3 flex gap-3">
                  <img
                    src={i.image || `https://placehold.co/64x80/e7e5e4/78716c?text=${encodeURIComponent(i.name)}`}
                    alt={i.name}
                    className="w-14 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-xs text-stone-500">
                      {i.size && `Size: ${i.size}`}
                      {i.size && i.color && ' · '}
                      {i.color && `Color: ${i.color}`}
                      {' · '}Qty: {i.qty}
                    </p>
                  </div>
                  <p className="text-sm whitespace-nowrap">{formatPKR(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 text-sm space-y-1 border-t border-stone-200 pt-3">
              <Row label="Subtotal" value={formatPKR(order.subtotal)} />
              <Row label="Shipping" value={order.shippingFee === 0 ? 'Free' : formatPKR(order.shippingFee)} />
              <div className="flex justify-between font-semibold text-base pt-1">
                <dt>Total</dt>
                <dd>{formatPKR(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="bg-white border border-stone-200 rounded-lg p-5">
            <h2 className="font-semibold mb-2">Customer</h2>
            <p className="text-sm">{order.userId?.name}</p>
            <p className="text-sm text-stone-500">{order.userId?.email}</p>
          </section>

          <section className="bg-white border border-stone-200 rounded-lg p-5">
            <h2 className="font-semibold mb-2">Shipping address</h2>
            <p className="text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-stone-600">{order.shippingAddress.phone}</p>
            <p className="text-sm text-stone-600">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
            </p>
            <p className="text-sm text-stone-600">
              {order.shippingAddress.city}
              {order.shippingAddress.postalCode && ` — ${order.shippingAddress.postalCode}`}
            </p>
          </section>
        </div>

        <aside className="space-y-4 h-fit">
          <section className="bg-white border border-stone-200 rounded-lg p-5">
            <h2 className="font-semibold mb-3">Order status</h2>
            <select
              disabled={saving}
              value={order.orderStatus}
              onChange={(e) => updateField('orderStatus', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-stone-300 capitalize"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </section>

          <section className="bg-white border border-stone-200 rounded-lg p-5">
            <h2 className="font-semibold mb-3">Payment</h2>
            <p className="text-sm mb-2">
              Method: <span className="font-medium">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card (simulated)'}</span>
            </p>
            <select
              disabled={saving}
              value={order.paymentStatus}
              onChange={(e) => updateField('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-stone-300 capitalize"
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone-600">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
