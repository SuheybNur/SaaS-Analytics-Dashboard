import type { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: string
  height?: string
  variant?: 'text' | 'rect' | 'circle'
}

export default function Skeleton({
  width = '100%',
  height = '1rem',
  variant = 'rect',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const shapeClass = variant === 'circle' ? 'skeleton-circle' : variant === 'text' ? 'skeleton-text' : 'skeleton-rect'

  return (
    <span
      className={`skeleton ${shapeClass} ${className}`.trim()}
      style={{ width, height, ...style }}
      aria-busy="true"
      {...props}
    />
  )
}
