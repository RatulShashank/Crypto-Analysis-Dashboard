import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';

interface VolumeProfileChartProps {
  pair: string;
  data?: any;
  chartData?: any;
}

export default function VolumeProfileChart({ pair, data, chartData: rawChartData }: VolumeProfileChartProps) {
  // Use passed data or fallback
  const chartData = rawChartData?.length ? rawChartData.map((d: any) => ({
    time: d.datetime.split(' ')[1] || d.datetime,
    price: d.close,
    volume: d.volume,
    high: d.high,
    low: d.low
  })) : [];
  
  const profileData = data?.profile || [];
  const vah = data?.vah || 0;
  const val = data?.val || 0;
  const poc = data?.poc || 0;

  return (
    <Card className="p-6 border border-border">
      <div className="mb-4">
        <h2 className="text-lg font-bold">{pair} - 1H Chart</h2>
        <p className="text-xs text-muted-foreground">Volume Profile with Value Area</p>
      </div>

      {/* Main Chart */}
      <div className="h-96 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0066ff"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Bar dataKey="volume" fill="rgba(0, 102, 255, 0.2)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Profile Histogram */}
      <div className="bg-card/50 p-4 rounded-lg border border-border/50">
        <h3 className="text-sm font-bold mb-3">Volume Distribution</h3>
        <div className="space-y-2">
          {profileData.slice(0, 10).map((item: any, idx: number) => {
            // Calculate percentage based on max volume
            const maxVol = Math.max(...profileData.map((d: any) => d.volume));
            const pct = maxVol > 0 ? (item.volume / maxVol) * 100 : 0;
            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono w-16 text-right text-muted-foreground">
                  ${item.price.toFixed(0)}
                </span>
                <div className="flex-1 h-6 bg-primary/10 rounded border border-primary/20 relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/60 to-primary/30 rounded"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-mono w-12 text-right text-primary">
                  {item.volume.toFixed(0)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Value Area Indicators */}
        <div className="mt-4 pt-4 border-t border-border/50 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAH:</span>
            <span className="font-mono font-bold text-primary">${vah.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">POC:</span>
            <span className="font-mono font-bold text-accent">${poc.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAL:</span>
            <span className="font-mono font-bold text-destructive">${val.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
