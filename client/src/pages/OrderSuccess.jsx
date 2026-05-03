import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGetOrder } from '../api/client.js';
import { formatPKR } from '../utils/format.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetOrder(id)
      .then((o) => {
        setOrder(o);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setStatus('error');
      });
  }, [id]);

  if (status === 'loading') return <Loader />;
  if (status === 'error') return <ErrorBox message={error} />;
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl">✓</div>
        <h1 className="text-2xl font-semibold mt-4">Order placed!</h1>
        <p className="text-stone-600 mt-1 text-sm">
          Order ID: <span className="font-mono">{order._id}</span>
        </p>
      </div>

      <div className="mt-8 bg-white border border-stone-200 rounded-lg p-5">
        <h2 className="font-semibold mb-3">Items</h2>
        <ul className="divide-y divide-stone-100 text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="py-2 flex justify-between gap-3">
              <div>
                <p className="font-medium">{i.name}</p>
                <p className="text-xs text-stone-500">
                  {i.size && `Size: ${i.size}`}
                  {i.size && i.color && ' · '}
                  {i.color && `Color: ${i.color}`}
                  {' · '}Qty: {i.qty}
                </p>
              </div>
              <p className="whitespace-nowrap">{formatPKR(i.price * i.qty)}</p>
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
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <h3 className="font-semibold mb-2">Shipping to</h3>
          <p className="text-sm text-stone-700">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-stone-600">{order.shippingAddress.phone}</p>
          <p className="text-sm text-stone-600">
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
          </p>
          <p className="text-sm text-stone-600">
            {order.shippingAddress.city}
            {order.shippingAddress.postalCode && ` — ${order.shippingAddress.postalCode}`}
          </p>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <h3 className="font-semibold mb-2">Payment</h3>
          <p className="text-sm text-stone-700">
            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card (simulated)'}
          </p>
          <p className="text-xs text-stone-500 mt-1">Status: {order.paymentStatus}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-3 justify-center">
        <Link to="/orders" className="px-5 py-2.5 rounded-md border border-stone-300 hover:bg-stone-100">
          View my orders
        </Link>
        <Link to="/" className="px-5 py-2.5 rounded-md bg-amber-700 text-white hover:bg-amber-800">
          Continue shopping
        </Link>
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
