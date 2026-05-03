import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    const params = { sort };
    if (activeCategory) params.category = activeCategory;
    if (search.trim()) params.search = search.trim();

    fetchProducts(params)
      .then((data) => {
        if (cancelled) return;
        setProducts(data.items);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.message || err.message);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [activeCategory, search, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Curated clothing from Swabi</h1>
        <p className="text-stone-600 mt-1">Kurtas, suits, fabric, and accessories — delivered to your door.</p>
      </section>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="flex-1 px-3 py-2 rounded-md border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-md border border-stone-300 bg-white"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-3 py-1.5 rounded-full text-sm border ${activeCategory === '' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm border ${activeCategory === c ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorBox message={error} />}
      {status === 'ready' && products.length === 0 && (
        <p className="text-center text-stone-500 py-16">No products match your filters.</p>
      )}
      {status === 'ready' && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
