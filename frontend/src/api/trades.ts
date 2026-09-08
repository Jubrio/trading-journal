import { api } from '../lib/api'
import type { Trade } from '../types'

export interface ActivateTradePayload {
  activated: boolean
  activation_time?: string
  entry_price?: number
  sl_price?: number
  tp_price?: number
}

export interface UpdateTradePayload {
  mae_pips?: number
  mfe_pips?: number
  be_touched?: boolean
  be_time?: string
  result_type?: string
  result_pips?: number
  result_usd?: number
  result_r?: number
  exit_time?: string
  notes?: string
}

export async function activateTrade(analysisId: number, payload: ActivateTradePayload) {
  const { data } = await api.post<Trade>(`/analyses/${analysisId}/trade`, payload)
  return data
}

export async function updateTrade(tradeId: number, payload: UpdateTradePayload) {
  const { data } = await api.patch<Trade>(`/trades/${tradeId}`, payload)
  return data
}
