import { api } from '../lib/api'
import type { DashboardSummary, EquityPoint } from '../types'

export async function fetchSummary(tradingAccountId?: number) {
  const { data } = await api.get<DashboardSummary>('/dashboard/summary', {
    params: { trading_account_id: tradingAccountId },
  })
  return data
}

export async function fetchEquityCurve(tradingAccountId?: number) {
  const { data } = await api.get<EquityPoint[]>('/dashboard/equity-curve', {
    params: { trading_account_id: tradingAccountId },
  })
  return data
}

export async function fetchPerformanceBySetup(tradingAccountId?: number) {
  const { data } = await api.get('/dashboard/performance-by-setup', {
    params: { trading_account_id: tradingAccountId },
  })
  return data
}
