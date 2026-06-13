export default function EmptyState({ heading, sub }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border mb-3">🔒</div>
      <h3 className="text-lg font-semibold">{heading}</h3>
      <p className="text-gray-500 text-sm mt-1">{sub}</p>
    </div>
  );
}