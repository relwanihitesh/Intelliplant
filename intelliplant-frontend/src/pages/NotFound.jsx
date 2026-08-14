import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-graphite-950 text-center px-6">
      <AlertTriangle size={22} style={{ color: 'var(--color-amber-signal)' }} className="mb-4" />
      <p className="font-mono text-[11px] tracking-widest text-graphite-500 mb-2">ERROR 404</p>
      <h1 className="font-display text-2xl text-graphite-50 mb-2">Sector not found</h1>
      <p className="text-sm text-graphite-400 mb-6">This route doesn't exist on the console.</p>
      <Link to="/" className="text-sm text-graphite-950 bg-[var(--color-amber-signal)] rounded-md px-4 py-2 font-medium hover:brightness-110 transition">
        Back to dashboard
      </Link>
    </div>
  )
}
