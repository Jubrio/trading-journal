import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Analysis } from '../types'
import { fetchAnalyses } from '../api/analyses'
import Card from '../components/ui/Card'

const SESSION_LABEL: Record<string, string> = {
  asia: 'Asie',
  london: 'Londres',
  new_york: 'New York',
}

export default function Analyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchAnalyses()
      .then((data) => {
        if (!cancelled) setAnalyses(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de charger les analyses.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-lg text-ink">
          Analyses <span className="text-ink/50">({analyses.length})</span>
        </h1>
        <Link
          to="/analyses/new"
          className="rounded bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          + Nouvelle analyse
        </Link>
      </div>

      {loading && <p className="text-sm text-ink/60">Chargement…</p>}
      {error && <p className="text-sm text-loss">{error}</p>}

      {!loading && !error && analyses.length === 0 && (
        <Card>
          <p className="text-sm text-ink/60">
            Aucune analyse pour l’instant.{' '}
            <Link to="/analyses/new" className="underline">
              Crée la première
            </Link>
            .
          </p>
        </Card>
      )}

      {!loading && !error && analyses.length > 0 && (
        <ul className="flex flex-col gap-3">
          {analyses.map((a) => {
            const isActivated = a.trade?.activated === true
            const rr = a.planned_rr ?? null

            return (
              <li key={a.id}>
                <Link
                  to={`/analyses/${a.id}`}
                  className="block border border-line bg-white transition-colors hover:bg-paper"
                >
                  <div className="flex flex-col gap-2 px-4 py-4 sm:px-6 sm:py-5">
                    {/* Ligne 1 : symbole + date + statut */}
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-base text-ink">
                          {a.symbol}
                        </span>
                        <span className="text-sm text-ink/60">
                          {new Date(a.analysis_date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                          {a.analysis_time && ` · ${a.analysis_time.slice(0, 5)}`}
                        </span>
                      </div>

                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          isActivated
                            ? 'bg-accent/10 text-accent'
                            : 'bg-ink/5 text-ink/60'
                        }`}
                      >
                        {isActivated ? 'Trade activé' : 'Non déclenché'}
                      </span>
                    </div>

                    {/* Ligne 2 : zones + timeframe + session */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {a.zone_types?.slice(0, 5).map((z) => (
                        <span
                          key={z.id}
                          className="rounded border border-line px-2 py-0.5 font-mono text-ink/70"
                        >
                          {z.code}
                        </span>
                      ))}
                      {a.zone_timeframe && (
                        <span className="text-ink/50">
                          Timeframe : <span className="font-mono">{a.zone_timeframe}</span>
                        </span>
                      )}
                      {a.session && (
                        <span className="text-ink/50">
                          Session : {SESSION_LABEL[a.session] ?? a.session}
                        </span>
                      )}
                    </div>

                    {/* Ligne 3 : RR prévu, RR réel, entrée */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink/60">
                      <span>
                        Entrée :{' '}
                        <span className="font-mono text-ink/80">{a.entry_method}</span>
                      </span>
                      {rr !== null && (
                        <span>
                          RR prévu :{' '}
                          <span className="font-mono text-ink/80">{rr}</span>
                        </span>
                      )}
                      {a.trade?.result_r != null && (
                        <span>
                          RR réel :{' '}
                          <span
                            className={`font-mono ${
                              a.trade.result_r >= 0 ? 'text-accent' : 'text-loss'
                            }`}
                          >
                            {a.trade.result_r >= 0 ? '+' : ''}
                            {a.trade.result_r}R
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}