import { Link, useNavigate } from 'react-router-dom';
import { useCart, FREE_SHIPPING_THRESHOLD } from '../context/CartContext.jsx';
import { formatPKR } from '../utils/format.js';

export default function Cart() {
  const { items, updateQty, removeItem, totals, lineKey } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-stone-500 mt-2">Browse our collection and add something you love.</p>
        <Link
          to="/"
          className="inline-block mt-6 px-5 py-2.5 rounded-md bg-amber-700 text-white hover:bg-amber-800"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Your cart</h1>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <ul className="space-y-4">
          {items.map((item) => {
            const k = lineKey(item);
            return (
              <li key={k} className="flex gap-4 bg-white border border-stone-200 rounded-lg p-3">
                <Link to={`/product/${item.slug}`} className="shrink-0">
                  <img
                    src={item.image || `https://placehold.co/120x150/e7e5e4/78716c?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    className="w-24 h-28 object-cover rounded-md"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.slug}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span> · </span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <div className="mt-2 font-semibold">{formatPKR(item.price)}</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center border border-stone-300 rounded-md">
                      <button
                        onClick={() => updateQty(k, item.qty - 1)}
                        className="w-8 h-8 hover:bg-stone-100"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQty(k, item.qty + 1)}
                        className="w-8 h-8 hover:bg-stone-100"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(k)}
                      className="text-sm text-stone-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold whitespace-nowrap">
                  {formatPKR(item.price * item.qty)}
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="bg-white border border-stone-200 rounded-lg p-5 h-fit lg:sticky lg:top-36">
          <h2 className="font-semibold mb-3">Order summary</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between">
              <dt className="text-stone-600">Subtotal ({totals.count} item{totals.count !== 1 && 's'})</dt>
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

          {remainingForFreeShipping > 0 && (
            <p className="text-xs text-stone-500 mt-3">
              Add {formatPKR(remainingForFreeShipping)} more to qualify for free shipping.
            </p>
          )}

          <button
            onClick={() => navigate('/checkout')}
            className="mt-5 w-full py-2.5 rounded-md bg-amber-700 text-white font-medium hover:bg-amber-800"
          >
            Proceed to checkout
          </button>
          <Link
            to="/"
            className="block text-center mt-2 text-sm text-stone-600 hover:text-stone-900"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
