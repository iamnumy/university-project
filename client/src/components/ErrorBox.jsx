export default function ErrorBox({ message }) {
  return (
    <div className="max-w-md mx-auto my-12 p-4 rounded-md border border-red-200 bg-red-50 text-red-800 text-sm">
      <p className="font-medium mb-1">Something went wrong</p>
      <p>{message}</p>
    </div>
  );
}
