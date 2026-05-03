import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totals } = useCart();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-32 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Swabi Bazaar — Home">
          <img src="/swabi-bazaar-logo.svg" alt="Swabi Bazaar" className="h-28 w-auto" />
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'text-amber-700 font-medium' : 'text-stone-600 hover:text-stone-900'
            }
          >
            Shop
          </NavLink>

          {user && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? 'text-amber-700 font-medium' : 'text-stone-600 hover:text-stone-900'
              }
            >
              Orders
            </NavLink>
          )}

          <Link
            to="/cart"
            className="relative px-2 py-1.5 text-stone-600 hover:text-stone-900"
            aria-label="Cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {totals.count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-700 text-white text-[10px] font-semibold flex items-center justify-center">
                {totals.count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-stone-700">
                Hi, <span className="font-medium">{user.name.split(' ')[0]}</span>
              </span>
              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? 'text-amber-700 font-medium' : 'text-stone-600 hover:text-stone-900'
                  }
                >
                  Admin
                </NavLink>
              )}
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 rounded-md text-stone-700 hover:bg-stone-100">
                Sign in
              </Link>
              <Link to="/signup" className="px-3 py-1.5 rounded-md bg-amber-700 text-white hover:bg-amber-800">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
