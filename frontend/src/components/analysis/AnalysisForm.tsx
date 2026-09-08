import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import ZoneTypeSelector from './ZoneTypeSelector'
import Card from '../ui/Card'
import { createAnalysis } from '../../api/analyses'
import { fetchZoneTypes } from '../../api/zoneTypes'
import type { ZoneType } from '../../types'

const TIMEFRAMES = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1']
const SESSIONS = [
  { value: 'asia', label: 'Asie' },
  { value: 'london', label: 'Londres' },
  { value: 'new_york', label: 'New York' },
]

export default function AnalysisForm({ tradingAccountId }: { tradingAccountId: number }) {
  const [zoneTypes, setZoneTypes] = useState<ZoneType[]>([])
  const [zoneTypeIds, setZoneTypeIds] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchZoneTypes().then(setZoneTypes).catch(() => setZoneTypes([]))
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    const form = new FormData(e.currentTarget)

    try {
      await createAnalysis({
        trading_account_id: tradingAccountId,
        symbol: String(form.get('symbol')),
        analysis_date: String(form.get('analysis_date')),
        analysis_time: String(form.get('analysis_time')),
        session: String(form.get('session') || '') || undefined,
        killzone: String(form.get('killzone') || '') || undefined,
        zone_timeframe: String(form.get('zone_timeframe')),
        entry_method: String(form.get('entry_method')),
        entry_distance_pips: Number(form.get('entry_distance_pips')) || undefined,
        planned_sl_pips: Number(form.get('planned_sl_pips')),
        planned_tp_pips: Number(form.get('planned_tp_pips')),
        missed_distance_pips: Number(form.get('missed_distance_pips')) || undefined,
        hypothetical_result: String(form.get('hypothetical_result') || '') || undefined,
        notes: String(form.get('notes') || ''),
        zone_type_ids: zoneTypeIds,
        trading_setup_ids: [],
      })
      setSaved(true)
      e.currentTarget.reset()
      setZoneTypeIds([])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card title="Zone">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Paire
            <input name="symbol" required placeholder="EURUSD" className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Timeframe de la zone
            <select name="zone_timeframe" required className="input">
              {TIMEFRAMES.map((tf) => (
                <option key={tf} value={tf}>{tf}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Date
            <input type="date" name="analysis_date" required className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Heure d'analyse
            <input type="time" name="analysis_time" required className="input" />
          </label>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm text-ink/60">Type(s) de zone</p>
          <ZoneTypeSelector options={zoneTypes} selected={zoneTypeIds} onChange={setZoneTypeIds} />
        </div>
      </Card>

      <Card title="Entrée planifiée">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Méthode d'entrée
            <input name="entry_method" required placeholder="Fibo OTE + clôture FVG" className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Distance prix → entrée (pips)
            <input type="number" step="0.1" name="entry_distance_pips" className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            SL prévu (pips)
            <input type="number" step="0.1" name="planned_sl_pips" required className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            TP prévu (pips)
            <input type="number" step="0.1" name="planned_tp_pips" required className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Session
            <select name="session" className="input">
              <option value="">—</option>
              {SESSIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Killzone
            <input name="killzone" className="input" />
          </label>
        </div>
      </Card>

      <Card title="Si l'entrée n'est pas déclenchée">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Distance manquée (pips)
            <input type="number" step="0.1" name="missed_distance_pips" className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Résultat hypothétique
            <select name="hypothetical_result" className="input">
              <option value="">—</option>
              <option value="tp">TP</option>
              <option value="sl">SL</option>
              <option value="be">BE</option>
              <option value="no_move">Aucun mouvement</option>
              <option value="other">Autre</option>
            </select>
          </label>
        </div>
      </Card>

      <Card title="Notes">
        <textarea name="notes" rows={3} className="input" placeholder="Commentaire personnel" />
      </Card>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-ink px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Enregistrement…' : "Enregistrer l'analyse"}
        </button>
        {saved && <span className="text-sm text-accent">Analyse enregistrée.</span>}
      </div>
    </form>
  )
}
