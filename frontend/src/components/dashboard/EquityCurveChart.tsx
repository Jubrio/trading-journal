import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { EquityPoint } from '../../types'
import Card from '../ui/Card'

export default function EquityCurveChart({ data }: { data: EquityPoint[] }) {
  return (
    <Card title="Equity curve (R cumulé)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#e2e0da" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#12181f99' }}
              tickFormatter={(d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
            />
            <YAxis tick={{ fontSize: 11, fill: '#12181f99' }} />
            <Tooltip
              formatter={(value: number) => [`${value}R`, 'Cumulé']}
              labelFormatter={(d) => new Date(d).toLocaleDateString('fr-FR')}
            />
            <Line
              type="monotone"
              dataKey="cumulative_r"
              stroke="#1f7a53"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
