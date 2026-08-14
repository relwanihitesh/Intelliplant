import { FileText } from 'lucide-react'

export default function SourceTag({ title, index }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded border border-graphite-600 bg-graphite-800 px-2 py-1 text-[11px] font-mono text-graphite-200">
      <FileText size={11} className="text-teal-signal shrink-0" style={{ color: 'var(--color-teal-signal)' }} />
      <span className="text-graphite-400">DOC-{String(index + 1).padStart(2, '0')}</span>
      <span className="text-graphite-600">·</span>
      <span className="truncate max-w-[160px]">{title}</span>
    </div>
  )
}
