export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <label className="block mb-4">
      {label && <span className="block text-xs font-medium text-graphite-300 mb-1.5">{label}</span>}
      <select
        className={`w-full bg-graphite-900 border ${error ? 'border-red-signal' : 'border-graphite-600'} rounded-md px-3 py-2.5 text-sm text-graphite-50 outline-none focus:border-amber-signal focus:ring-1 focus:ring-amber-signal/40 transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="block text-[11px] mt-1" style={{ color: 'var(--color-red-signal)' }}>{error}</span>}
    </label>
  )
}
