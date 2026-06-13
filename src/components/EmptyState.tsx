import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="state-card">
      <div className="state-icon-wrapper" aria-hidden="true">
        {icon ?? (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="state-icon">
            <rect x="6" y="10" width="36" height="28" rx="6" fill="#eef2ff" />
            <path d="M16 18H32" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 24H28" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 30H24" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div>
        <h3 className="state-title">{title}</h3>
        <p className="state-description">{description}</p>
      </div>
      <div className="state-actions">
        <button type="button" className="state-button" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
