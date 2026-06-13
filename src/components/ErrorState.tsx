import type { ReactNode } from 'react'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry: () => void
  icon?: ReactNode
}

export default function ErrorState({
  title = 'Something went wrong',
  description = 'Unable to load this section. Try again to refresh the content.',
  onRetry,
  icon,
}: ErrorStateProps) {
  return (
    <div className="state-card error-state">
      <div className="state-icon-wrapper" aria-hidden="true">
        {icon ?? (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="state-icon">
            <circle cx="24" cy="24" r="20" fill="#fee2e2" />
            <path d="M24 16V26" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            <path d="M24 32H24.01" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div>
        <h3 className="state-title">{title}</h3>
        <p className="state-description">{description}</p>
      </div>
      <div className="state-actions">
        <button type="button" className="state-button" onClick={onRetry}>
          Retry
        </button>
      </div>
    </div>
  )
}
