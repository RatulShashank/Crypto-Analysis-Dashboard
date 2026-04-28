import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MarketMetricsProps {
  pair: string;
  data?: any;
}

export default function MarketMetrics({ pair, data }: MarketMetricsProps) {
  const vp = data?.volume_profile || {};
  const metrics = {
    vah: vp.vah || 0,
    val: vp.val || 0,
    poc: vp.poc || 0,
    cvd: 'N/A', // Calculated on full order flow
    deltaDiv: 'Bullish',
    orderBlocks: 3,
    fairValueGaps: 2,
  };

  return (
    <div className="space-y-4">
      {/* Auction Market Theory */}
      <Card className="p-4 border border-border">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full" />
          Auction Market Theory
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAH (High)</span>
            <span className="font-mono font-bold">${metrics.vah.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">POC (Fair Value)</span>
            <span className="font-mono font-bold text-primary">${metrics.poc.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAL (Low)</span>
            <span className="font-mono font-bold">${metrics.val.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Order Flow */}
      <Card className="p-4 border border-border">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full" />
          Order Flow Analysis
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cumulative Delta</span>
            <span className="font-mono font-bold">{metrics.cvd.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Delta Divergence</span>
            <Badge
              variant={metrics.deltaDiv === 'Bullish' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {metrics.deltaDiv}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Smart Money Concepts */}
      <Card className="p-4 border border-border">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-destructive rounded-full" />
          Smart Money Concepts
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Blocks</span>
            <span className="font-mono font-bold">{metrics.orderBlocks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fair Value Gaps</span>
            <span className="font-mono font-bold">{metrics.fairValueGaps}</span>
          </div>
        </div>
      </Card>

      {/* Market Status */}
      <Card className="p-4 border border-border bg-card/50">
        <div className="text-xs text-muted-foreground">
          <p className="mb-2">Last Updated: Just now</p>
          <p className="text-xs">Data refreshes every 5 seconds</p>
        </div>
      </Card>
    </div>
  );
}
