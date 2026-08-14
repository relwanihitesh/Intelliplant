import { Factory } from 'lucide-react'
import StatusDot from './StatusDot'

const PANEL_DEPARTMENTS = [
  'HR', 'Production', 'Maintenance', 'Quality', 'Safety', 'IT',
  'Logistics', 'Engineering', 'Finance', 'Training',
]

export default function AuthLayout({ children, eyebrow, title, subtitle }) {
  return (
    <div className="min-h-screen w-full flex bg-graphite-950">
      {/* Left: signature status panel */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 border-r border-graphite-700 panel-grid overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-graphite-950/0 via-graphite-950/40 to-graphite-950 pointer-events-none" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-amber-signal/15 border border-amber-signal/30 flex items-center justify-center" style={{ backgroundColor: 'rgba(245,165,36,0.12)', borderColor: 'rgba(245,165,36,0.3)' }}>
            <Factory size={16} style={{ color: 'var(--color-amber-signal)' }} />
          </div>
          <span className="font-display font-semibold tracking-tight text-graphite-50">IntelliPlant</span>
        </div>

        <div className="relative">
          <p className="font-mono text-[11px] tracking-widest text-graphite-500 mb-3">SYSTEM STATUS — KNOWLEDGE INDEX</p>
          <h1 className="font-display text-4xl leading-[1.1] text-graphite-50 mb-4 max-w-md">
            Every department's knowledge, <span style={{ color: 'var(--color-amber-signal)' }}>on call.</span>
          </h1>
          <p className="text-graphite-400 text-sm max-w-sm leading-relaxed">
            IntelliPlant reads your plant's manuals, SOPs and policies so your team gets answers with a source, not a guess.
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-x-8 gap-y-2.5">
          {PANEL_DEPARTMENTS.map((dept, i) => (
            <div key={dept} className="flex items-center gap-2 font-mono text-[11px] text-graphite-400 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <StatusDot color={i % 3 === 0 ? 'amber' : i % 3 === 1 ? 'teal' : 'green'} live={i % 4 === 0} />
              <span>{dept}</span>
              <span className="ml-auto text-graphite-600">INDEXED</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded bg-amber-signal/15 border border-amber-signal/30 flex items-center justify-center" style={{ backgroundColor: 'rgba(245,165,36,0.12)', borderColor: 'rgba(245,165,36,0.3)' }}>
              <Factory size={14} style={{ color: 'var(--color-amber-signal)' }} />
            </div>
            <span className="font-display font-semibold text-graphite-50">IntelliPlant</span>
          </div>

          {eyebrow && <p className="font-mono text-[11px] tracking-widest text-graphite-500 mb-2">{eyebrow}</p>}
          <h2 className="font-display text-2xl text-graphite-50 mb-1.5">{title}</h2>
          {subtitle && <p className="text-graphite-400 text-sm mb-8">{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  )
}
