/**
 * EmptyState — shared across all views
 * Used in Cluster 1 (no search results), Cluster 3 (empty saved lists), Cluster 4 (no restaurants)
 */
export default function EmptyState({ icon: Icon, title, description, actions }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center text-center py-16 px-8 gap-4"
    >
      {Icon && (
        <div
          className="w-14 h-14 rounded-full bg-surface-raised flex items-center justify-center"
          aria-hidden="true"
        >
          <Icon size={24} className="text-text-muted" />
        </div>
      )}
      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="font-syne text-base font-semibold text-text-primary">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-text-secondary font-dm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={i === 0 ? 'btn-primary text-sm px-5' : 'btn-secondary text-sm px-5'}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
