type EmptyStateProps = {
  eyebrow?: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  eyebrow = '还没有内容',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-orbit" aria-hidden="true">
        <div className="empty-state-core">✦</div>
      </div>
      <div className="section-eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && (
        <button className="button button-primary" onClick={onAction}>
          {actionLabel} <span>↗</span>
        </button>
      )}
    </div>
  )
}
