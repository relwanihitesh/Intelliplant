import { NavLink } from 'react-router-dom'
import { LayoutGrid, MessageSquare, UploadCloud, Building2, UserRound, LogOut, Factory } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StatusDot from './StatusDot'
import { ROLE_LABELS } from '../lib/constants'

const NAV_ITEMS = [
  { to: '/', label: 'Documents', icon: LayoutGrid, end: true },
  { to: '/chat', label: 'Ask IntelliPlant', icon: MessageSquare },
  { to: '/upload', label: 'Upload Document', icon: UploadCloud, adminOnly: true },
  { to: '/departments', label: 'Departments', icon: Building2, adminOnly: true },
  { to: '/profile', label: 'My Profile', icon: UserRound },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-graphite-900 border-r border-graphite-700">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-graphite-700">
        <div className="w-7 h-7 rounded bg-amber-signal/15 border border-amber-signal/30 flex items-center justify-center" style={{ backgroundColor: 'rgba(245,165,36,0.12)', borderColor: 'rgba(245,165,36,0.3)' }}>
          <Factory size={15} style={{ color: 'var(--color-amber-signal)' }} />
        </div>
        <div className="leading-tight">
          <p className="font-display font-semibold text-sm tracking-tight text-graphite-50">IntelliPlant</p>
          <p className="text-[10px] font-mono text-graphite-400 tracking-wide">KNOWLEDGE CONSOLE</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-mono text-graphite-500 tracking-widest mb-2">MODULES</p>
        {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-graphite-800 text-graphite-50 border border-graphite-600'
                  : 'text-graphite-300 border border-transparent hover:bg-graphite-800/60 hover:text-graphite-100'
              }`
            }
          >
            <item.icon size={15} className="shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-graphite-700">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-graphite-800/60 mb-1.5">
          <div className="w-8 h-8 rounded-full bg-graphite-700 flex items-center justify-center text-xs font-display font-semibold text-graphite-100 shrink-0">
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-sm text-graphite-100 truncate">{user?.username}</p>
            <div className="flex items-center gap-1.5">
              <StatusDot color={isAdmin ? 'amber' : 'teal'} live />
              <p className="text-[11px] font-mono text-graphite-400 truncate">
                {ROLE_LABELS[user?.role] || user?.role} · {user?.department || '—'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-graphite-400 hover:text-red-signal hover:bg-graphite-800/60 transition-colors"
          style={{ '--tw-text-opacity': 1 }}
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
