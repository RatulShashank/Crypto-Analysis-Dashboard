import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OrderFlowPanelProps {
  pair: string;
  data?: any[];
}

export default function OrderFlowPanel({ pair, data }: OrderFlowPanelProps) {
  // Extract Session metrics
  const sessions = data || [];
  const latestSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
  const deltaData = sessions.map((s, idx) => ({
    time: s.date,
    delta: s.asia_range || 0
  }));

  return (
    <Card className="p-6 border border-border">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Order Flow & Delta Analysis</h2>
        <p className="text-xs text-muted-foreground">Cumulative Delta vs Price Action</p>
      </div>

      {/* Delta Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={deltaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="delta"
              stroke="#ffa500"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Order Flow Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card/50 p-3 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Buy Volume</p>
          <p className="text-lg font-bold font-mono text-primary">1,245,600</p>
          <p className="text-xs text-muted-foreground mt-1">Contracts</p>
        </div>
        <div className="bg-card/50 p-3 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Sell Volume</p>
          <p className="text-lg font-bold font-mono text-destructive">1,089,400</p>
          <p className="text-xs text-muted-foreground mt-1">Contracts</p>
        </div>
      </div>

      {/* Divergence Signal */}
      <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold">Delta Divergence Signal</span>
          <Badge variant="default" className="text-xs">BULLISH</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Price made lower low but delta made higher low. Strong buying pressure detected.
        </p>
      </div>

      {/* Footprint Zones */}
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-bold">High Volume Nodes</h3>
        {[
          { price: 45100, buyVol: 450, sellVol: 120, strength: 85 },
          { price: 45050, buyVol: 380, sellVol: 150, strength: 72 },
          { price: 45000, buyVol: 320, sellVol: 200, strength: 61 },
        ].map((node, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs">
            <span className="font-mono w-16 text-right text-muted-foreground">
              ${node.price}
            </span>
            <div className="flex-1 h-5 bg-card/50 rounded border border-border/50 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary/60 to-primary/30"
                style={{ width: `${node.strength}%` }}
              />
            </div>
            <span className="font-mono text-xs w-20 text-right text-muted-foreground">
              B:{node.buyVol} S:{node.sellVol}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
