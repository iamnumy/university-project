import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  apiAdminCreateProduct,
  apiAdminGetProduct,
  apiAdminUpdateProduct,
} from '../../api/client.js';
import Loader from '../../components/Loader.jsx';
import ErrorBox from '../../components/ErrorBox.jsx';

const blank = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compareAtPrice: '',
  category: '',
  sizes: '',
  colors: '',
  images: '',
  stock: '0',
  isActive: true,
};

const fromProduct = (p) => ({
  name: p.name || '',
  slug: p.slug || '',
  description: p.description || '',
  price: String(p.price ?? ''),
  compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
  category: p.category || '',
  sizes: (p.sizes || []).join(', '),
  colors: (p.colors || []).join(', '),
  images: (p.images || []).join('\n'),
  stock: String(p.stock ?? 0),
  isActive: p.isActive !== false,
});

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(blank);
  const [loadStatus, setLoadStatus] = useState(isEdit ? 'loading' : 'ready');
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    apiAdminGetProduct(id)
      .then((p) => {
        setForm(fromProduct(p));
        setLoadStatus('ready');
      })
      .catch((err) => {
        setLoadError(err.response?.data?.message || err.message);
        setLoadStatus('error');
      });
  }, [id, isEdit]);

  const onChange = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: form.price,
        compareAtPrice: form.compareAtPrice || null,
        category: form.category,
        sizes: form.sizes,
        colors: form.colors,
        images: form.images,
        stock: form.stock,
        isActive: form.isActive,
      };
      if (isEdit) {
        await apiAdminUpdateProduct(id, payload);
      } else {
        await apiAdminCreateProduct(payload);
      }
      navigate('/admin/products', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadStatus === 'loading') return <Loader />;
  if (loadStatus === 'error') return <ErrorBox message={loadError} />;

  return (
    <div>
      <Link to="/admin/products" className="text-sm text-stone-500 hover:text-stone-900">
        ← Back to products
      </Link>
      <h1 className="text-2xl font-semibold mt-2 mb-6">
        {isEdit ? 'Edit product' : 'New product'}
      </h1>

      <form onSubmit={onSubmit} className="space-y-5 bg-white border border-stone-200 rounded-lg p-6 max-w-2xl">
        {error && (
          <div className="px-3 py-2 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            {error}
          </div>
        )}

        <Field label="Name" required value={form.name} onChange={onChange('name')} />
        <Field
          label="Slug (optional)"
          value={form.slug}
          onChange={onChange('slug')}
          hint="Auto-generated from name if blank. URL-safe characters only."
        />
        <Textarea
          label="Description"
          rows={3}
          value={form.description}
          onChange={onChange('description')}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Price (PKR)" required type="number" min="0" value={form.price} onChange={onChange('price')} />
          <Field
            label="Compare-at price (optional)"
            type="number"
            min="0"
            value={form.compareAtPrice}
            onChange={onChange('compareAtPrice')}
            hint="Original price, shown crossed-out for sale items."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category" required value={form.category} onChange={onChange('category')} />
          <Field label="Stock" type="number" min="0" value={form.stock} onChange={onChange('stock')} />
        </div>

        <Field
          label="Sizes (comma-separated)"
          value={form.sizes}
          onChange={onChange('sizes')}
          hint="e.g. S, M, L, XL"
        />
        <Field
          label="Colors (comma-separated)"
          value={form.colors}
          onChange={onChange('colors')}
          hint="e.g. White, Mint, Powder Blue"
        />
        <Textarea
          label="Image URLs (one per line, or comma-separated)"
          rows={3}
          value={form.images}
          onChange={onChange('images')}
          hint="Paste full URLs. First image is used as the thumbnail."
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={onChange('isActive')}
            className="accent-amber-700"
          />
          Active (visible in store)
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-md bg-amber-700 text-white font-medium hover:bg-amber-800 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-md border border-stone-300 hover:bg-stone-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, hint, min }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/30"
      />
      {hint && <span className="block text-xs text-stone-500 mt-1">{hint}</span>}
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 3, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/30"
      />
      {hint && <span className="block text-xs text-stone-500 mt-1">{hint}</span>}
    </label>
  );
}
