import type { ReactNode } from 'react'

export default function Card({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`border border-line bg-white p-5 ${className}`}>
      {title && <h3 className="mb-3 text-sm font-medium text-ink/60">{title}</h3>}
      {children}
    </div>
  )
}
