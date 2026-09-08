import { useEffect, useState } from 'react'
import StatsCards from '../components/dashboard/StatsCards'
import EquityCurveChart from '../components/dashboard/EquityCurveChart'
import { fetchSummary, fetchEquityCurve } from '../api/dashboard'
import type { DashboardSummary, EquityPoint } from '../types'

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [curve, setCurve] = useState<EquityPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchSummary(), fetchEquityCurve()])
      .then(([s, c]) => {
        setSummary(s)
        setCurve(c)
      })
      .catch(() => setError("Impossible de charger le tableau de bord pour l'instant."))
  }, [])

  if (error) {
    return <p className="text-sm text-loss">{error}</p>
  }

  if (!summary) {
    return <p className="text-sm text-ink/50">Chargement…</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-medium text-ink">Tableau de bord</h1>
      <StatsCards summary={summary} />
      <EquityCurveChart data={curve} />
    </div>
  )
}
