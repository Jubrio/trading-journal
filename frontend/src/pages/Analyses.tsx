import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAnalyses } from '../api/analyses'
import type { Analysis } from '../types'
import Card from '../components/ui/Card'

export default function Analyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])

  useEffect(() => {
    fetchAnalyses().then(setAnalyses).catch(() => setAnalyses([]))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-medium text-ink">Analyses</h1>

      {analyses.length === 0 && (
        <Card>
          <p className="text-sm text-ink/60">Aucune analyse enregistrée pour l'instant.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {analyses.map((a) => (
          <Link key={a.id} to={`/analyses/${a.id}`}>
            <Card className="transition-colors hover:border-ink/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">
                    {a.symbol} — {new Date(a.analysis_date).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="truncate text-sm text-ink/60">
                    {a.entry_method} · RR prévu {a.planned_rr}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    a.trade?.activated
                      ? 'bg-accent-soft text-accent'
                      : 'bg-paper text-ink/50'
                  }`}
                >
                  {a.trade?.activated ? 'Trade activé' : 'Non déclenché'}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
