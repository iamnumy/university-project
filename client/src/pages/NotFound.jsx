import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-24 px-4">
      <p className="text-5xl font-semibold text-stone-300">404</p>
      <h1 className="text-xl font-medium mt-2">Page not found</h1>
      <p className="text-stone-500 mt-1">The page you're looking for doesn't exist.</p>
      <Link to="/" className="inline-block mt-6 text-amber-700 hover:underline">Go home</Link>
    </div>
  );
}
