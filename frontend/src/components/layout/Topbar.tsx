import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { api } from '../../lib/api'

export default function Topbar() {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  async function handleLogout() {
    try {
      await api.post('/logout')
    } catch {
      // Even if the request fails (token already expired, network hiccup),
      // still clear local state and send the user back to login.
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('trading_account_id')
      navigate('/login')
    }
  }

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
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded border border-line px-2.5 py-1.5 text-xs text-ink/60 transition-colors hover:border-loss hover:text-loss sm:text-sm"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  )
}
