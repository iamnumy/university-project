import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiAdminStats } from '../../api/client.js';
import { formatPKR } from '../../utils/format.js';
import Loader from '../../components/Loader.jsx';
import ErrorBox from '../../components/ErrorBox.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    apiAdminStats()
      .then((s) => {
        setStats(s);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setStatus('error');
      });
  }, []);

  if (status === 'loading') return <Loader />;
  if (status === 'error') return <ErrorBox message={error} />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue" value={formatPKR(stats.revenue)} />
        <StatCard label="Orders" value={stats.orderCount} />
        <StatCard label="Products" value={stats.productCount} />
        <StatCard label="Customers" value={stats.customerCount} />
      </div>

      <section className="mt-8">
        <h2 className="font-semibold mb-3">Orders by status</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(stats.byStatus).map(([k, v]) => (
            <div key={k} className="bg-white border border-stone-200 rounded-lg p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-stone-500">{k}</p>
              <p className="text-xl font-semibold mt-1">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="font-semibold">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm text-amber-700 hover:underline">
            View all →
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-stone-500">No orders yet.</p>
        ) : (
          <ul className="bg-white border border-stone-200 rounded-lg divide-y divide-stone-100">
            {stats.recentOrders.map((o) => (
              <li key={o._id}>
                <Link
                  to={`/admin/orders/${o._id}`}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-stone-50"
                >
                  <div>
                    <p className="font-mono text-sm">#{o._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-stone-500">
                      {o.userId?.name || 'Guest'} ·{' '}
                      {new Date(o.createdAt).toLocaleString('en-PK', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPKR(o.total)}</p>
                    <p className="text-xs text-stone-500 capitalize">{o.orderStatus}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
