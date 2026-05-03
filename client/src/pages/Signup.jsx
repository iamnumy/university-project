import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-center">Create your account</h1>
      <p className="text-stone-600 text-sm text-center mt-1">Join Swabi Bazaar in a few seconds.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 bg-white p-6 rounded-lg border border-stone-200">
        {error && (
          <div className="px-3 py-2 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/30"
          />
        </div>

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
            autoComplete="new-password"
            required
            minLength={6}
            className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/30"
          />
          <p className="text-xs text-stone-500 mt-1">At least 6 characters.</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-md bg-amber-700 text-white font-medium hover:bg-amber-800 disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-sm text-center text-stone-600">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
