import AnalysisForm from '../components/analysis/AnalysisForm'

export default function NewAnalysis() {
  const tradingAccountId = Number(localStorage.getItem('trading_account_id')) || 1

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-medium text-ink">Nouvelle analyse</h1>
      <AnalysisForm tradingAccountId={tradingAccountId} />
    </div>
  )
}
