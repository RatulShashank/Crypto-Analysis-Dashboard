import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Analysis() {
  const volatilityData = [
    { time: '09:00', volatility: 2.1, zscore: 0.5 },
    { time: '10:00', volatility: 2.3, zscore: 0.8 },
    { time: '11:00', volatility: 2.0, zscore: 0.3 },
    { time: '12:00', volatility: 2.8, zscore: 1.2 },
    { time: '13:00', volatility: 2.4, zscore: 0.9 },
    { time: '14:00', volatility: 2.2, zscore: 0.6 },
  ];

  const correlationData = [
    { pair: 'BTC/ETH', correlation: 0.92 },
    { pair: 'BTC/SOL', correlation: 0.78 },
    { pair: 'ETH/SOL', correlation: 0.85 },
    { pair: 'BTC/USDT', correlation: -0.05 },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Market Analysis</h1>
          <p className="text-muted-foreground">Deep dive into market structure and statistical metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Volatility & Z-Score */}
          <Card className="p-6 border border-border">
            <h2 className="text-lg font-bold mb-4">Volatility & Z-Score</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volatilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 26, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="volatility"
                    stroke="#0066ff"
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="zscore"
                    stroke="#ffa500"
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Correlation Matrix */}
          <Card className="p-6 border border-border">
            <h2 className="text-lg font-bold mb-4">Pair Correlations</h2>
            <div className="space-y-3">
              {correlationData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-mono">{item.pair}</span>
                  <div className="flex-1 mx-4 h-6 bg-card/50 rounded border border-border/50 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/60 to-primary/30"
                      style={{ width: `${item.correlation * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold w-12 text-right">
                    {item.correlation.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Statistical Summary */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold mb-4">Statistical Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Mean Price', value: '$45,150', unit: 'USDT' },
              { label: 'Std Dev', value: '450.25', unit: 'Points' },
              { label: 'Skewness', value: '0.34', unit: 'Distribution' },
              { label: 'Kurtosis', value: '2.81', unit: 'Excess' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-card/50 p-4 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-lg font-bold font-mono">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.unit}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
