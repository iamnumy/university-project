import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/format.js';

export default function ProductCard({ product }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group rounded-lg overflow-hidden bg-white border border-stone-200 hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/5] bg-stone-100 overflow-hidden">
        <img
          src={product.images?.[0] || `https://placehold.co/400x500/e7e5e4/78716c?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://placehold.co/400x500/e7e5e4/78716c?text=${encodeURIComponent(product.name)}`;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-stone-500">{product.category}</p>
        <h3 className="text-sm font-medium mt-1 line-clamp-1">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatPKR(product.price)}</span>
          {onSale && (
            <span className="text-xs text-stone-400 line-through">{formatPKR(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
