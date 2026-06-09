// Reusable heading block for sections: a small eyebrow label, a main title
// and an optional descriptive subtitle. Left-aligned editorial style by
// default, with an optional centered variant.
function SectionTitle({ eyebrow, title, subtitle, align = 'left' }) {
  const alignment =
    align === 'center'
      ? 'items-center text-center'
      : 'items-start text-left'

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 ring-1 ring-brand-100">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-gold-500"
          />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionTitle
