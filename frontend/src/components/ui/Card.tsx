import type { ReactNode } from 'react'

export default function Card({
  title,
  action,
  children,
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="border border-line bg-white">
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
          {title && (
            <h2 className="font-mono text-xs tracking-wide text-ink/60 uppercase">
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </section>
  )
}