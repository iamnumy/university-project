import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiMyOrders } from '../api/client.js';
import { formatPKR } from '../utils/format.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    apiMyOrders()
      .then((data) => {
        setOrders(data);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setStatus('error');
      });
  }, []);

  if (status === 'loading') return <Loader />;
  if (status === 'error') return <ErrorBox message={error} />;

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">No orders yet</h1>
        <p className="text-stone-500 mt-2">When you place an order, it will show up here.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2.5 rounded-md bg-amber-700 text-white hover:bg-amber-800">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My orders</h1>
      <ul className="space-y-4">
        {orders.map((o) => (
          <li key={o._id} className="bg-white border border-stone-200 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium font-mono text-sm">#{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-stone-500">
                  {new Date(o.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={o.orderStatus} />
                <p className="font-semibold">{formatPKR(o.total)}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {o.items.slice(0, 4).map((it, i) => (
                <img
                  key={i}
                  src={it.image || `https://placehold.co/80x100/e7e5e4/78716c?text=${encodeURIComponent(it.name)}`}
                  alt={it.name}
                  className="w-16 h-20 object-cover rounded-md shrink-0"
                />
              ))}
              {o.items.length > 4 && (
                <div className="w-16 h-20 rounded-md border border-stone-200 flex items-center justify-center text-xs text-stone-500 shrink-0">
                  +{o.items.length - 4}
                </div>
              )}
            </div>
            <div className="mt-3 text-right">
              <Link to={`/orders/${o._id}`} className="text-sm text-amber-700 hover:underline">
                View details →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const STATUS_STYLES = {
  placed: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-amber-100 text-amber-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || 'bg-stone-100 text-stone-700'}`}>
      {status}
    </span>
  );
}
