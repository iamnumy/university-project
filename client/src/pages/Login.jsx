import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-center">Welcome back</h1>
      <p className="text-stone-600 text-sm text-center mt-1">Sign in to continue shopping.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 bg-white p-6 rounded-lg border border-stone-200">
        {error && (
          <div className="px-3 py-2 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            minLength={6}
            className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/30"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-md bg-amber-700 text-white font-medium hover:bg-amber-800 disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-sm text-center text-stone-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-amber-700 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
