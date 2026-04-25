/**
 * Sidebar — left panel, context-switches per active view via Outlet.
 * On desktop: fixed left 380px. On mobile: full-width overlay.
 */
export default function Sidebar({ children }) {
  return (
    <aside
      className="w-full lg:w-[380px] flex-shrink-0 bg-surface border-r border-border overflow-hidden flex flex-col"
      aria-label="Side panel"
    >
      {children}
    </aside>
  )
}
