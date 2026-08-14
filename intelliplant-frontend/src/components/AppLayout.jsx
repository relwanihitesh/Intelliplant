import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-graphite-950">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
