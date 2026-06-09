// Reusable heading block for sections: a small eyebrow label, a main title
// and an optional descriptive subtitle. Centered layout by default.
function SectionTitle({ eyebrow, title, subtitle, align = 'center' }) {
  const alignment =
    align === 'left' ? 'text-left items-start' : 'text-center items-center'

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="max-w-2xl text-base leading-relaxed text-slate-600">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionTitle
