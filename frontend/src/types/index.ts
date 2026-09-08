export type Session = 'asia' | 'london' | 'new_york'
export type HypotheticalResult = 'tp' | 'sl' | 'be' | 'no_move' | 'other'
export type ResultType = 'tp' | 'sl' | 'be' | 'manual_close'

export interface ZoneType {
  id: number
  code: string
  label: string
}

export interface TradingSetup {
  id: number
  code: string
  label: string
  color?: string
}

export interface Trade {
  id: number
  analysis_id: number
  activated: boolean
  activation_time: string | null
  entry_price: number | null
  sl_price: number | null
  tp_price: number | null
  mae_pips: number | null
  mfe_pips: number | null
  be_touched: boolean
  result_type: ResultType | null
  result_pips: number | null
  result_usd: number | null
  result_r: number | null
  exit_time: string | null
}

export interface Analysis {
  id: number
  trading_account_id: number
  symbol: string
  analysis_date: string
  analysis_time: string
  session: Session | null
  killzone: string | null
  zone_timeframe: string
  entry_method: string
  entry_distance_pips: number | null
  planned_sl_pips: number
  planned_tp_pips: number
  planned_rr: number
  missed_distance_pips: number | null
  hypothetical_result: HypotheticalResult | null
  notes: string | null
  zone_types?: ZoneType[]
  trading_setups?: TradingSetup[]
  trade?: Trade | null
}

export interface DashboardSummary {
  real_performance: {
    trades: number
    win_rate: number | null
    net_r: number
    avg_rr_planned: number
  }
  missed_opportunities: {
    analyses: number
    potential_r: number
  }
}

export interface EquityPoint {
  date: string
  cumulative_r: number
}
