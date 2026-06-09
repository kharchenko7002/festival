// Small pill-shaped label used for categories, statuses and tags.
// `variant` selects the colour scheme, `children` holds the visible text.
const variants = {
  brand: 'bg-brand-100 text-brand-700',
  accent: 'bg-cyan-100 text-cyan-700',
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
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
