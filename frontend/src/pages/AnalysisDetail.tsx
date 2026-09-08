import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import { fetchAnalysis } from '../api/analyses'
import { activateTrade, updateTrade } from '../api/trades'
import type { Analysis } from '../types'

export default function AnalysisDetail() {
  const { id } = useParams<{ id: string }>()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    if (!id) return
    setLoading(true)
    try {
      const data = await fetchAnalysis(Number(id))
      setAnalysis(data)
    } catch {
      setError("Impossible de charger cette analyse.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) return <p className="text-sm text-ink/50">Chargement…</p>
  if (error) return <p className="text-sm text-loss">{error}</p>
  if (!analysis) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/analyses" className="text-sm text-ink/50 hover:text-ink">
          ← Retour aux analyses
        </Link>
        <h1 className="mt-2 text-xl font-medium text-ink">
          {analysis.symbol} — {new Date(analysis.analysis_date).toLocaleDateString('fr-FR')}
        </h1>
      </div>

      <Card title="Zone & entrée planifiée">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ink/50">Timeframe</p>
            <p className="text-ink">{analysis.zone_timeframe}</p>
          </div>
          <div>
            <p className="text-ink/50">Méthode d'entrée</p>
            <p className="text-ink">{analysis.entry_method}</p>
          </div>
          <div>
            <p className="text-ink/50">SL / TP prévus</p>
            <p className="text-ink">{analysis.planned_sl_pips} / {analysis.planned_tp_pips} pips</p>
          </div>
          <div>
            <p className="text-ink/50">RR prévu</p>
            <p className="text-ink">{analysis.planned_rr}</p>
          </div>
        </div>
        {analysis.zone_types && analysis.zone_types.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.zone_types.map((z) => (
              <span key={z.id} className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent">
                {z.label}
              </span>
            ))}
          </div>
        )}
      </Card>

      {!analysis.trade?.activated ? (
        <ActivateTradeForm analysisId={analysis.id} onActivated={reload} />
      ) : (
        <TradeResultPanel trade={analysis.trade} onUpdated={reload} />
      )}
    </div>
  )
}

function ActivateTradeForm({
  analysisId,
  onActivated,
}: {
  analysisId: number
  onActivated: () => void
}) {
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const form = new FormData(e.currentTarget)

    try {
      await activateTrade(analysisId, {
        activated: true,
        activation_time: String(form.get('activation_time') || '') || undefined,
        entry_price: Number(form.get('entry_price')) || undefined,
        sl_price: Number(form.get('sl_price')) || undefined,
        tp_price: Number(form.get('tp_price')) || undefined,
      })
      onActivated()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card title="Activer le trade">
      <p className="mb-4 text-sm text-ink/60">
        Cette analyse n'a pas encore de trade réel associé. Renseigne les prix pour marquer
        l'entrée comme prise.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Heure d'activation
            <input type="datetime-local" name="activation_time" className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Prix d'entrée
            <input type="number" step="0.00001" name="entry_price" className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Prix SL
            <input type="number" step="0.00001" name="sl_price" className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Prix TP
            <input type="number" step="0.00001" name="tp_price" className="input" />
          </label>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-fit rounded bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Enregistrement…' : 'Marquer comme activé'}
        </button>
      </form>
    </Card>
  )
}

function TradeResultPanel({
  trade,
  onUpdated,
}: {
  trade: NonNullable<Analysis['trade']>
  onUpdated: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const closed = trade.result_type !== null

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const form = new FormData(e.currentTarget)

    try {
      await updateTrade(trade.id, {
        result_type: String(form.get('result_type') || '') || undefined,
        result_pips: Number(form.get('result_pips')) || undefined,
        result_usd: Number(form.get('result_usd')) || undefined,
        result_r: Number(form.get('result_r')) || undefined,
        exit_time: String(form.get('exit_time') || '') || undefined,
        mae_pips: Number(form.get('mae_pips')) || undefined,
        mfe_pips: Number(form.get('mfe_pips')) || undefined,
      })
      onUpdated()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card title={closed ? 'Résultat du trade' : 'Clôturer le trade'}>
      {closed ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ink/50">Résultat</p>
            <p className="text-ink uppercase">{trade.result_type}</p>
          </div>
          <div>
            <p className="text-ink/50">RR réel</p>
            <p className={trade.result_r && trade.result_r >= 0 ? 'text-accent' : 'text-loss'}>
              {trade.result_r}R
            </p>
          </div>
          <div>
            <p className="text-ink/50">Pips</p>
            <p className="text-ink">{trade.result_pips}</p>
          </div>
          <div>
            <p className="text-ink/50">$</p>
            <p className="text-ink">{trade.result_usd}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Résultat
              <select name="result_type" required className="input">
                <option value="">—</option>
                <option value="tp">TP</option>
                <option value="sl">SL</option>
                <option value="be">BE</option>
                <option value="manual_close">Fermeture manuelle</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Heure de clôture
              <input type="datetime-local" name="exit_time" className="input" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Résultat (pips)
              <input type="number" step="0.1" name="result_pips" className="input" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Résultat ($)
              <input type="number" step="0.01" name="result_usd" className="input" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              RR réel
              <input type="number" step="0.01" name="result_r" className="input" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              MAE (pips)
              <input type="number" step="0.1" name="mae_pips" className="input" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              MFE (pips)
              <input type="number" step="0.1" name="mfe_pips" className="input" />
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-fit rounded bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Enregistrement…' : 'Clôturer le trade'}
          </button>
        </form>
      )}
    </Card>
  )
}
