// Highlight card showing a single key figure (value) with a short label.
// Used in the metrics strip below the hero.
function StatCard({ value, label, icon }) {
  return (
    <div className="card-lift flex flex-col gap-2 p-6 ring-1 ring-slate-100">
      {icon && (
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl ring-1 ring-brand-100"
        >
          {icon}
        </span>
      )}
      <span className="text-4xl font-bold tracking-tight text-navy-900">
        {value}
      </span>
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
  )
}

export default StatCard
