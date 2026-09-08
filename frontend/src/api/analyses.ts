import { api } from '../lib/api'
import type { Analysis } from '../types'

export interface AnalysisPayload {
  trading_account_id: number
  symbol: string
  analysis_date: string
  analysis_time: string
  session?: string
  killzone?: string
  zone_timeframe: string
  entry_method: string
  entry_distance_pips?: number
  planned_sl_pips: number
  planned_tp_pips: number
  missed_distance_pips?: number
  hypothetical_result?: string
  notes?: string
  zone_type_ids: number[]
  trading_setup_ids: number[]
}

export async function fetchAnalyses(params?: Record<string, string>) {
  const { data } = await api.get<{ data: Analysis[] }>('/analyses', { params })
  return data.data
}

export async function fetchAnalysis(id: number) {
  const { data } = await api.get<Analysis>(`/analyses/${id}`)
  return data
}

export async function createAnalysis(payload: AnalysisPayload) {
  const { data } = await api.post<Analysis>('/analyses', payload)
  return data
}
