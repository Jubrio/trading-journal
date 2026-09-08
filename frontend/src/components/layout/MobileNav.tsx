import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks, PlusCircle } from 'lucide-react'

const links = [
  { to: '/', label: 'Tableau', icon: LayoutDashboard, end: true },
  { to: '/analyses', label: 'Analyses', icon: ListChecks, end: false },
  { to: '/analyses/new', label: 'Nouvelle', icon: PlusCircle, end: false },
]

// Bottom tab bar shown only on small screens (< md). The desktop Sidebar
// covers the same navigation on larger viewports.
export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-white md:hidden">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs ${
              isActive ? 'text-accent' : 'text-ink/50'
            }`
          }
        >
          <Icon size={20} strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
