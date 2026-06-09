// Highlight card showing a single key figure (value) with a short label.
// Used in the hero section to summarise the festival at a glance.
function StatCard({ value, label, icon }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-3xl font-bold text-white sm:text-4xl">{value}</span>
      <span className="text-sm font-medium text-brand-100">{label}</span>
    </div>
  )
}

export default StatCard
