export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-2.5 text-graphite-300 text-sm font-mono">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-signal opacity-60" style={{ backgroundColor: 'var(--color-amber-signal)' }} />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: 'var(--color-amber-signal)' }} />
      </span>
      {label}…
    </div>
  )
}
