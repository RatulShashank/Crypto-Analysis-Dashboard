import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConfigurationModalProps {
  onConfigured: (config: any) => void;
}

export default function ConfigurationModal({ onConfigured }: ConfigurationModalProps) {
  const [sourceType, setSourceType] = useState<'local' | 'api' | 'yfinance'>('local');
  const [klinePath, setKlinePath] = useState('f:/Quant/Antigravity-Projects/crypto-quant-dashboard/Datasets/');
  const [oiPath, setOiPath] = useState('');
  const [fundingPath, setFundingPath] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_source_type: sourceType,
          local_path: sourceType === 'local' ? klinePath : null,
          oi_path: sourceType === 'local' ? oiPath : null,
          funding_path: sourceType === 'local' ? fundingPath : null,
          api_key: sourceType === 'api' ? apiKey : null,
          symbol: 'BTCUSDT',
          start_date: startDate,
          end_date: endDate
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to configure');

      onConfigured(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 shadow-xl border-primary/20">
        <h2 className="text-2xl font-bold mb-4 text-primary">System Configuration</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Configure the data source for the quantitative analysis engine.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={sourceType === 'local' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSourceType('local')}
            >
              Local
            </Button>
            <Button
              type="button"
              variant={sourceType === 'api' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSourceType('api')}
            >
              Binance API
            </Button>
            <Button
              type="button"
              variant={sourceType === 'yfinance' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSourceType('yfinance')}
            >
              YFinance
            </Button>
          </div>

          {sourceType === 'local' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kline Dataset Path (Required)</label>
                <input
                  type="text"
                  value={klinePath}
                  onChange={(e) => setKlinePath(e.target.value)}
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground"
                  placeholder="e.g. C:/Datasets/Kline/"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Open Interest Path (Optional)</label>
                <input
                  type="text"
                  value={oiPath}
                  onChange={(e) => setOiPath(e.target.value)}
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground"
                  placeholder="e.g. C:/Datasets/OI/"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Funding Rate Path (Optional)</label>
                <input
                  type="text"
                  value={fundingPath}
                  onChange={(e) => setFundingPath(e.target.value)}
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground"
                  placeholder="e.g. C:/Datasets/Funding/"
                />
              </div>
            </div>
          )}

          {sourceType === 'api' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Binance API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 rounded-md bg-input border border-border text-foreground"
                placeholder="Enter API Key"
                required
              />
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Start Date (Optional)</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 rounded-md bg-input border border-border text-foreground"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">End Date (Optional)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 rounded-md bg-input border border-border text-foreground"
              />
            </div>
          </div>

          {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>}

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Initializing Engine...' : 'Launch Dashboard'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
