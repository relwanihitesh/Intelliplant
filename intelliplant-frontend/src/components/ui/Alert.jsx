import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function Alert({ type = 'error', children }) {
  if (!children) return null
  const isError = type === 'error'
  return (
    <div
      className="flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm mb-4"
      style={{
        borderColor: isError ? 'rgba(229,72,77,0.35)' : 'rgba(70,209,111,0.35)',
        backgroundColor: isError ? 'rgba(229,72,77,0.08)' : 'rgba(70,209,111,0.08)',
        color: isError ? '#f5a3a5' : '#8fe0a7',
      }}
    >
      {isError ? <AlertTriangle size={15} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={15} className="mt-0.5 shrink-0" />}
      <span>{children}</span>
    </div>
  )
}
