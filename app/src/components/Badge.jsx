// Small pill-shaped label used for categories, statuses and tags.
// `variant` selects the colour scheme, `children` holds the visible text.
const variants = {
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
  accent: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100',
  gold: 'bg-gold-300 text-navy-900 ring-1 ring-gold-400',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
}

function Badge({ children, variant = 'brand', className = '' }) {
  const color = variants[variant] ?? variants.neutral

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${color} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
