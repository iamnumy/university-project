import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  apiAdminListProducts,
  apiAdminDeleteProduct,
} from '../../api/client.js';
import { formatPKR } from '../../utils/format.js';
import Loader from '../../components/Loader.jsx';
import ErrorBox from '../../components/ErrorBox.jsx';

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const load = (s = '') => {
    setStatus('loading');
    apiAdminListProducts(s ? { search: s } : {})
      .then((data) => {
        setItems(data.items);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setStatus('error');
      });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search.trim()), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await apiAdminDeleteProduct(id);
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          to="/admin/products/new"
          className="px-4 py-2 rounded-md bg-amber-700 text-white text-sm hover:bg-amber-800"
        >
          + Add product
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, slug, or category…"
        className="w-full md:w-80 mb-4 px-3 py-2 rounded-md border border-stone-300"
      />

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorBox message={error} />}
      {status === 'ready' && items.length === 0 && (
        <p className="text-stone-500 py-8 text-center">No products match.</p>
      )}
      {status === 'ready' && items.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((p) => (
                <tr key={p._id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || `https://placehold.co/48x60/e7e5e4/78716c?text=${encodeURIComponent(p.name[0])}`}
                        alt={p.name}
                        className="w-10 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-stone-500">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 text-right">{formatPKR(p.price)}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.isActive ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/products/${p._id}/edit`}
                      className="text-amber-700 hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(p._id, p.name)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
