export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 px-8 py-6 border-b border-graphite-700">
      <div>
        {eyebrow && <p className="font-mono text-[11px] tracking-widest text-graphite-500 mb-1.5">{eyebrow}</p>}
        <h1 className="font-display text-xl text-graphite-50">{title}</h1>
        {description && <p className="text-sm text-graphite-400 mt-1 max-w-xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
