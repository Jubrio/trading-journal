import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Tableau de bord' },
  { to: '/analyses', label: 'Analyses' },
  { to: '/analyses/new', label: 'Nouvelle analyse' },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-line bg-white px-6 py-8 md:flex md:flex-col">
      <div className="mb-10">
        <p className="font-mono text-sm tracking-tight text-ink">
          My<span className="text-accent">Trade</span>Journal
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `rounded px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-accent-soft text-accent font-medium'
                  : 'text-ink/70 hover:bg-paper hover:text-ink'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
