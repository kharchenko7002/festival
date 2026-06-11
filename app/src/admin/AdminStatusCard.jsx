function AdminStatusCard({ overridesCount, onLogout }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100">
      <div className="flex items-center gap-3">
        <span
          className="h-2.5 w-2.5 rounded-full bg-emerald-500"
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-slate-700">
          Innlogget som festivalsjef
        </span>
        {overridesCount > 0 && (
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            {overridesCount} endring{overridesCount === 1 ? '' : 'er'}
          </span>
        )}
      </div>
      <button type="button" onClick={onLogout} className="btn-ghost !py-2">
        Logg ut
      </button>
    </div>
  )
}

export default AdminStatusCard
