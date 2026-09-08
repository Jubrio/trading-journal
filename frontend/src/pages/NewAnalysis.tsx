import AnalysisForm from '../components/analysis/AnalysisForm'

export default function NewAnalysis() {
  // trading_account_id hardcoded until the account switcher in Topbar is wired to context.
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-medium text-ink">Nouvelle analyse</h1>
      <AnalysisForm tradingAccountId={1} />
    </div>
  )
}
