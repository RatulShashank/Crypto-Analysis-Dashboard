import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Zap, BarChart3 } from 'lucide-react';
import MarketMetrics from '@/components/MarketMetrics';
import VolumeProfileChart from '@/components/VolumeProfileChart';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import SignalLog from '@/components/SignalLog';
import ConfigurationModal from '@/components/ConfigurationModal';

export default function Dashboard() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [isConfigured, setIsConfigured] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/dashboard-data');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    if (isConfigured) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 30000); // refresh every 30s
      return () => clearInterval(interval);
    }
  }, [isConfigured]);
  return (
    <DashboardLayout>
      {!isConfigured && (
        <ConfigurationModal onConfigured={() => setIsConfigured(true)} />
      )}
      
      <div className={`p-6 space-y-6 transition-opacity duration-500 ${!isConfigured ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {/* Top Section: Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            label="BTC Price"
            value={dashboardData?.chart_data ? `$${dashboardData.chart_data[dashboardData.chart_data.length-1]?.close.toFixed(2)}` : "Loading..."}
            change={2.45}
            icon={TrendingUp}
          />
          <MetricCard
            label="POC (Point of Control)"
            value={dashboardData?.volume_profile?.poc ? `$${dashboardData.volume_profile.poc.toFixed(2)}` : "Loading..."}
            change={0}
            icon={Zap}
          />
          <MetricCard
            label="Value Area High"
            value={dashboardData?.volume_profile?.vah ? `$${dashboardData.volume_profile.vah.toFixed(2)}` : "Loading..."}
            change={0}
            icon={BarChart3}
          />
          <MetricCard
            label="Value Area Low"
            value={dashboardData?.volume_profile?.val ? `$${dashboardData.volume_profile.val.toFixed(2)}` : "Loading..."}
            change={0}
            icon={TrendingDown}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Volume Profile & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <VolumeProfileChart pair={selectedPair} data={dashboardData?.volume_profile} chartData={dashboardData?.chart_data} />
            <OrderFlowPanel pair={selectedPair} data={dashboardData?.sessions} />
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            <MarketMetrics pair={selectedPair} data={dashboardData} />
            <SignalLog />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}

function MetricCard({ label, value, change, icon: Icon }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="p-4 border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-xl font-bold font-mono">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <Badge
              variant={isPositive ? 'default' : 'destructive'}
              className="text-xs"
            >
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </Badge>
          </div>
        </div>
        <Icon className={`w-8 h-8 ${isPositive ? 'text-primary' : 'text-destructive'} opacity-20`} />
      </div>
    </Card>
  );
}
