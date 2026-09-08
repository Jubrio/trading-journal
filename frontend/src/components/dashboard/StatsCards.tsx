import type { DashboardSummary } from '../../types'
import Card from '../ui/Card'

export default function StatsCards({ summary }: { summary: DashboardSummary }) {
  const { real_performance, missed_opportunities } = summary

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card title="Trades pris">
        <p className="font-mono text-2xl text-ink">{real_performance.trades}</p>
      </Card>
      <Card title="Win rate">
        <p className="font-mono text-2xl text-ink">
          {real_performance.win_rate !== null ? `${real_performance.win_rate}%` : '—'}
        </p>
      </Card>
      <Card title="Performance réelle">
        <p
          className={`font-mono text-2xl ${
            real_performance.net_r >= 0 ? 'text-accent' : 'text-loss'
          }`}
        >
          {real_performance.net_r >= 0 ? '+' : ''}
          {real_performance.net_r}R
        </p>
      </Card>
      <Card title="Opportunités manquées">
        <p className="font-mono text-lg text-ink/60 sm:text-2xl">
          {missed_opportunities.potential_r >= 0 ? '+' : ''}
          {missed_opportunities.potential_r}R potentiel
        </p>
        <p className="mt-1 text-xs text-ink/40">
          {missed_opportunities.analyses} analyse(s) non déclenchée(s)
        </p>
      </Card>
    </div>
  )
}
