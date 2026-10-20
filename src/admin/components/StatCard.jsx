export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-text-faint/15 bg-white2 p-4">
      <p className="text-sm text-text-soft">{label}</p>
      <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-text-faint">{hint}</p>}
    </div>
  );
}
