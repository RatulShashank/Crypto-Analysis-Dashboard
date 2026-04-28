import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, TrendingDown, Zap, CheckCircle } from 'lucide-react';

export default function Signals() {
  const allSignals = [
    {
      id: 1,
      type: 'BULLISH_DIVERGENCE',
      pair: 'BTC/USDT',
      signal: 'Delta Divergence',
      description: 'Price made lower low but delta made higher low. Strong buying pressure detected.',
      confidence: 85,
      timestamp: '2 min ago',
      status: 'ACTIVE',
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      id: 2,
      type: 'ORDER_BLOCK_BREAK',
      pair: 'ETH/USDT',
      signal: 'Order Block Break',
      description: 'Price broke above institutional order block with volume confirmation.',
      confidence: 72,
      timestamp: '15 min ago',
      status: 'ACTIVE',
      icon: Zap,
      color: 'text-accent',
    },
    {
      id: 3,
      type: 'VA_REJECTION',
      pair: 'BTC/USDT',
      signal: 'Value Area Rejection',
      description: 'Price rejected at VAH with low volume. Mean reversion likely.',
      confidence: 68,
      timestamp: '1 hour ago',
      status: 'CLOSED',
      icon: TrendingDown,
      color: 'text-destructive',
    },
    {
      id: 4,
      type: 'FVG_FILL',
      pair: 'SOL/USDT',
      signal: 'Fair Value Gap Fill',
      description: 'Fair value gap filled successfully. Support confirmed.',
      confidence: 91,
      timestamp: '2 hours ago',
      status: 'CLOSED',
      icon: CheckCircle,
      color: 'text-primary',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Trading Signals</h1>
          <p className="text-muted-foreground">Real-time algorithmic signals based on AMT, SMC, and Order Flow</p>
        </div>

        {/* Active Signals */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Active Signals
          </h2>
          <div className="space-y-3">
            {allSignals
              .filter((s) => s.status === 'ACTIVE')
              .map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
          </div>
        </div>

        {/* Closed Signals */}
        <div>
          <h2 className="text-lg font-bold mb-4">Closed Signals</h2>
          <div className="space-y-3">
            {allSignals
              .filter((s) => s.status === 'CLOSED')
              .map((signal) => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
          </div>
        </div>

        {/* Signal Statistics */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold mb-4">Signal Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Signals', value: '247', unit: 'This Week' },
              { label: 'Win Rate', value: '68.5%', unit: 'Accuracy' },
              { label: 'Avg Confidence', value: '76.3%', unit: 'Score' },
              { label: 'Profit Factor', value: '2.34', unit: 'Ratio' },
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

interface SignalCardProps {
  signal: {
    id: number;
    type: string;
    pair: string;
    signal: string;
    description: string;
    confidence: number;
    timestamp: string;
    status: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  };
}

function SignalCard({ signal }: SignalCardProps) {
  const Icon = signal.icon;

  return (
    <Card className="p-4 border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-4">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${signal.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div>
              <p className="text-sm font-bold">{signal.signal}</p>
              <p className="text-xs text-muted-foreground">{signal.pair}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant={signal.status === 'ACTIVE' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {signal.status}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {signal.confidence}%
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{signal.description}</p>
          <p className="text-xs text-muted-foreground/60">{signal.timestamp}</p>
        </div>
      </div>
    </Card>
  );
}
