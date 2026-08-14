export default function Button({ children, variant = 'primary', className = '', loading = false, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium px-4 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-[var(--color-amber-signal)] text-graphite-950 hover:brightness-110',
    secondary: 'bg-graphite-800 text-graphite-100 border border-graphite-600 hover:bg-graphite-700',
    ghost: 'text-graphite-300 hover:text-graphite-50 hover:bg-graphite-800',
    danger: 'bg-transparent border border-red-signal/40 text-red-signal hover:bg-red-signal/10',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
