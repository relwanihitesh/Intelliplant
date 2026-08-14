const COLORS = {
  amber: 'bg-[var(--color-amber-signal)]',
  teal: 'bg-[var(--color-teal-signal)]',
  green: 'bg-[var(--color-green-signal)]',
  red: 'bg-[var(--color-red-signal)]',
  gray: 'bg-graphite-500',
}

export default function StatusDot({ color = 'amber', live = false, size = 'sm' }) {
  const dim = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
  return (
    <span className={`inline-block rounded-full ${dim} ${COLORS[color]} ${live ? 'indicator-live' : ''}`} />
  )
}
