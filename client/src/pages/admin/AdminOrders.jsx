import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiAdminListOrders } from '../../api/client.js';
import { formatPKR } from '../../utils/format.js';
import Loader from '../../components/Loader.jsx';
import ErrorBox from '../../components/ErrorBox.jsx';

const STATUSES = ['', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_STYLES = {
  placed: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-amber-100 text-amber-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrders() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus('loading');
    apiAdminListOrders(filter ? { status: filter } : {})
      .then((data) => {
        setItems(data.items);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setStatus('error');
      });
  }, [filter]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {STATUSES.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm border capitalize ${
              filter === s
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorBox message={error} />}
      {status === 'ready' && items.length === 0 && (
        <p className="text-stone-500 py-8 text-center">No orders.</p>
      )}
      {status === 'ready' && items.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((o) => (
                <tr key={o._id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p>{o.userId?.name || '—'}</p>
                    <p className="text-xs text-stone-500">{o.userId?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {new Date(o.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
                  </td>
                  <td className="px-4 py-3 text-right">{formatPKR(o.total)}</td>
                  <td className="px-4 py-3 capitalize text-stone-600">{o.paymentStatus}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[o.orderStatus] || 'bg-stone-100 text-stone-700'}`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/orders/${o._id}`} className="text-amber-700 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
