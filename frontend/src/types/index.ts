/* ------------------------------------------------------------------
 |  Dashboard
 | ------------------------------------------------------------------ */

export interface DashboardSummary {
  total_analyses: number
  total_trades: number
  win_rate: number
  avg_rr: number
  profit_r: number
  loss_r: number
  net_r: number
  missed_r: number
}

export interface EquityPoint {
  date: string
  cumulative_r: number
}

export interface SetupPerformance {
  setup: string
  trades: number
  win_rate: number
  avg_rr: number
  expectancy: number
}

/* ------------------------------------------------------------------
 |  Analyses
 | ------------------------------------------------------------------ */

export type SessionType = 'asia' | 'london' | 'new_york'
export type HypotheticalResult = 'tp' | 'sl' | 'be' | 'none'

export interface ZoneType {
  id: number
  user_id: number
  code: string
  label: string
}

export interface TradingSetup {
  id: number
  user_id: number
  code: string
  label: string
}

export interface MarketContext {
  id: number
  analysis_id: number
  major_news: boolean
  news_name: string | null
  news_time: string | null
  volatility: string | null
  market_direction: string | null
  trades_before: number | null
  notes: string | null
}

export interface Analysis {
  id: number
  user_id: number
  trading_account_id: number
  symbol: string
  analysis_date: string
  analysis_time: string | null
  session: SessionType | null
  killzone: string | null
  zone_timeframe: string
  entry_method: string
  entry_distance_pips: number | null
  planned_sl_pips: number
  planned_tp_pips: number
  planned_rr: number | null
  missed_distance_pips: number | null
  hypothetical_result: HypotheticalResult | null
  notes: string | null
  created_at: string
  updated_at: string

  // relations
  zone_types?: ZoneType[]
  trading_setups?: TradingSetup[]
  market_context?: MarketContext | null
  trade?: Trade | null
  screenshots?: Screenshot[]
}

/* ------------------------------------------------------------------
 |  Trades
 | ------------------------------------------------------------------ */

export type TradeResultType = 'tp' | 'sl' | 'be' | 'manual'

export interface Trade {
  id: number
  analysis_id: number
  activated: boolean
  activation_time: string | null
  entry_price: number | null
  sl_price: number | null
  tp_price: number | null
  mae: number | null
  mfe: number | null
  be_touched: boolean
  be_time: string | null
  exit_price: number | null
  exit_time: string | null
  result_type: TradeResultType | null
  result_pips: number | null
  result_r: number | null
  result_usd: number | null
  duration_minutes: number | null
  created_at: string
  updated_at: string
}

/* ------------------------------------------------------------------
 |  Screenshots
 | ------------------------------------------------------------------ */

export type ScreenshotType =
  | 'before_entry'
  | 'at_entry'
  | 'after_close'
  | 'position'

export interface Screenshot {
  id: number
  analysis_id: number
  trade_id: number | null
  image_url: string
  type: ScreenshotType
  description: string | null
  created_at: string
}

/* ------------------------------------------------------------------
 |  Auth / utilisateur
 | ------------------------------------------------------------------ */

export interface User {
  id: number
  name: string
  email: string
  trading_account_id?: number
}