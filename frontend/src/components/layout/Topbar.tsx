export default function Topbar() {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3 sm:px-8 sm:py-4">
      <div className="flex items-center gap-3">
        <p className="font-mono text-sm text-ink md:hidden">
          My<span className="text-accent">Trade</span>Journal
        </p>
        <p className="hidden text-sm text-ink/60 capitalize sm:block">{today}</p>
      </div>
      <div className="flex items-center gap-3">
        <select className="rounded border border-line bg-paper px-2.5 py-1.5 text-xs text-ink sm:px-3 sm:text-sm">
          <option>Compte principal</option>
        </select>
      </div>
    </header>
  )
}
