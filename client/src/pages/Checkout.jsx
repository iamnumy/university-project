import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiCreateOrder } from '../api/client.js';
import { formatPKR } from '../utils/format.js';

export default function Checkout() {
  const { items, totals, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    line1: '',
    line2: '',
    city: 'Swabi',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Nothing to check out</h1>
        <p className="text-stone-500 mt-2">Your cart is empty.</p>
        <Link to="/" className="inline-block mt-4 text-amber-700 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          color: i.color,
          qty: i.qty,
        })),
        shippingAddress: form,
        paymentMethod,
      };
      const order = await apiCreateOrder(payload);
      clear();
      navigate(`/order-success/${order._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <section className="bg-white border border-stone-200 rounded-lg p-5">
            <h2 className="font-semibold mb-3">Shipping address</h2>
            {error && (
              <div className="px-3 py-2 mb-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
                {error}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full name" required value={form.fullName} onChange={onChange('fullName')} />
              <Field label="Phone" required value={form.phone} onChange={onChange('phone')} placeholder="03XX-XXXXXXX" />
              <Field label="Address line 1" required colSpan="2" value={form.line1} onChange={onChange('line1')} />
              <Field label="Address line 2 (optional)" colSpan="2" value={form.line2} onChange={onChange('line2')} />
              <Field label="City" required value={form.city} onChange={onChange('city')} />
              <Field label="Postal code" value={form.postalCode} onChange={onChange('postalCode')} />
            </div>
          </section>

          <section className="bg-white border border-stone-200 rounded-lg p-5">
            <h2 className="font-semibold mb-3">Payment method</h2>
            <div className="space-y-2">
              <PaymentOption
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={setPaymentMethod}
                title="Cash on Delivery"
                hint="Pay when your order arrives."
              />
              <PaymentOption
                value="card_simulated"
                checked={paymentMethod === 'card_simulated'}
                onChange={setPaymentMethod}
                title="Credit/Debit Card (simulated)"
                hint="Demo only — no real charge."
              />
            </div>
          </section>
        </div>

        <aside className="bg-white border border-stone-200 rounded-lg p-5 h-fit lg:sticky lg:top-36">
          <h2 className="font-semibold mb-3">Order summary</h2>
          <ul className="text-sm space-y-2 mb-3 max-h-64 overflow-y-auto">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between gap-2">
                <span className="text-stone-700">
                  {i.name} <span className="text-stone-400">× {i.qty}</span>
                </span>
                <span className="whitespace-nowrap">{formatPKR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="text-sm space-y-2 border-t border-stone-200 pt-3">
            <div className="flex justify-between">
              <dt className="text-stone-600">Subtotal</dt>
              <dd>{formatPKR(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-600">Shipping</dt>
              <dd>{totals.shippingFee === 0 ? 'Free' : formatPKR(totals.shippingFee)}</dd>
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between font-semibold text-base">
              <dt>Total</dt>
              <dd>{formatPKR(totals.total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full py-2.5 rounded-md bg-amber-700 text-white font-medium hover:bg-amber-800 disabled:opacity-50"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, placeholder, colSpan }) {
  return (
    <label className={colSpan === '2' ? 'sm:col-span-2' : ''}>
      <span className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/30"
      />
    </label>
  );
}

function PaymentOption({ value, checked, onChange, title, hint }) {
  return (
    <label className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer ${checked ? 'border-amber-700 bg-amber-50' : 'border-stone-300 hover:bg-stone-50'}`}>
      <input
        type="radio"
        name="payment"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 accent-amber-700"
      />
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-stone-500">{hint}</p>
      </div>
    </label>
  );
}
