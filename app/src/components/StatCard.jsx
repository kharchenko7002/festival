// Highlight card showing a single key figure (value) with a short label.
// Light themed so it can sit inside the hero dashboard mockup on white.
function StatCard({ value, label, icon }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {icon && (
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-lg"
        >
          {icon}
        </span>
      )}
      <span className="text-3xl font-bold text-slate-900">{value}</span>
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
  )
}

export default StatCard
