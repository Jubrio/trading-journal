import type { DashboardSummary } from '../../types'

export default function StatsCards({ summary }: { summary: DashboardSummary }) {
  const cards = [
    { label: 'Analyses', value: summary.total_analyses },
    { label: 'Trades pris', value: summary.total_trades },   
    { label: 'Win rate', value: `${summary.win_rate}%` },
    { label: 'RR moyen', value: summary.avg_rr },
    { label: 'Net réel', value: `${summary.net_r >= 0 ? '+' : ''}${summary.net_r}R` },
    { label: 'Opportunités manquées', value: `+${summary.missed_r}R`, accent: true },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="border border-line bg-white p-3 sm:p-4"
        >
          <p className="text-[11px] uppercase tracking-wide text-ink/50 sm:text-xs">
            {c.label}
          </p>
          <p
            className={`mt-1 text-lg font-medium sm:text-xl ${
              c.accent ? 'text-accent' : 'text-ink'
            }`}
          >
            {c.value}
          </p>
        </div>
      ))}
    </div>
  )
}