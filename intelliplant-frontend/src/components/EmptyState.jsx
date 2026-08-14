export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-graphite-700 rounded-lg bg-graphite-900/40">
      {Icon && (
        <div className="w-11 h-11 rounded-md bg-graphite-800 border border-graphite-700 flex items-center justify-center mb-4">
          <Icon size={18} className="text-graphite-400" />
        </div>
      )}
      <p className="font-display text-graphite-100 font-medium mb-1">{title}</p>
      {description && <p className="text-graphite-400 text-sm max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
