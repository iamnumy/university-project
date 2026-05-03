import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import { formatPKR } from '../utils/format.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setStatus('loading');
    setAdded(false);
    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes?.[0] || '');
        setColor(p.colors?.[0] || '');
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setStatus('error');
      });
  }, [slug]);

  const onAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      size,
      color,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const onBuyNow = () => {
    if (!product) return;
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      size,
      color,
      qty: 1,
    });
    navigate('/cart');
  };

  if (status === 'loading') return <Loader />;
  if (status === 'error') return <ErrorBox message={error} />;
  if (!product) return null;

  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const images = product.images?.length ? product.images : ['https://placehold.co/600x750?text=No+Image'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-stone-500 hover:text-stone-900">← Back to shop</Link>
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div>
          <div className="aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden">
            <img
              src={images[activeImage]}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://placehold.co/600x750/e7e5e4/78716c?text=${encodeURIComponent(product.name)}`;
              }}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 rounded-md overflow-hidden border-2 ${i === activeImage ? 'border-amber-700' : 'border-transparent'}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-stone-500">{product.category}</p>
          <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatPKR(product.price)}</span>
            {onSale && <span className="text-stone-400 line-through">{formatPKR(product.compareAtPrice)}</span>}
          </div>
          <p className="text-stone-600 mt-4 leading-relaxed">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-1.5 rounded-md text-sm border ${size === s ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 hover:bg-stone-100'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-3 py-1.5 rounded-md text-sm border ${color === c ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 hover:bg-stone-100'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-sm text-stone-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 py-3 rounded-md border border-amber-700 text-amber-700 font-medium hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? 'Added ✓' : 'Add to cart'}
            </button>
            <button
              onClick={onBuyNow}
              disabled={product.stock <= 0}
              className="flex-1 py-3 rounded-md bg-amber-700 text-white font-medium hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
