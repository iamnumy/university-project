export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center py-16 text-stone-500 text-sm">
      <span className="inline-block w-4 h-4 mr-2 border-2 border-stone-300 border-t-amber-700 rounded-full animate-spin" />
      {label}
    </div>
  );
}
