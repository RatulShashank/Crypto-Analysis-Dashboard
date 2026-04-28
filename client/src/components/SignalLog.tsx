import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, TrendingDown, Zap } from 'lucide-react';

export default function SignalLog() {
  // Mock signal history
  const signals = [
    {
      id: 1,
      type: 'BULLISH_DIVERGENCE',
      label: 'Delta Divergence',
      message: 'Bullish divergence detected on 1H',
      time: '2 min ago',
      confidence: 85,
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      id: 2,
      type: 'ORDER_BLOCK_BREAK',
      label: 'Order Block Break',
      message: 'Price broke above institutional OB',
      time: '15 min ago',
      confidence: 72,
      icon: Zap,
      color: 'text-accent',
    },
    {
      id: 3,
      type: 'VA_REJECTION',
      label: 'Value Area Rejection',
      message: 'Price rejected at VAH with low volume',
      time: '1 hour ago',
      confidence: 68,
      icon: TrendingDown,
      color: 'text-destructive',
    },
  ];

  return (
    <Card className="p-4 border border-border">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Trading Signals
      </h3>

      <div className="space-y-3">
        {signals.map((signal) => {
          const Icon = signal.icon;
          return (
            <div
              key={signal.id}
              className="p-3 bg-card/50 border border-border/50 rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${signal.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-bold truncate">{signal.label}</p>
                    <Badge
                      variant="secondary"
                      className="text-xs flex-shrink-0"
                    >
                      {signal.confidence}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {signal.message}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {signal.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Signals update in real-time
        </p>
      </div>
    </Card>
  );
}
