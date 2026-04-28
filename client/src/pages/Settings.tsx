import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure dashboard preferences and algorithm parameters</p>
        </div>

        {/* Display Settings */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold mb-4">Display Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chart Theme</p>
                <p className="text-sm text-muted-foreground">Dark mode for reduced eye strain</p>
              </div>
              <Badge variant="default">Dark</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Refresh Rate</p>
                <p className="text-sm text-muted-foreground">Update interval for live data</p>
              </div>
              <Badge variant="secondary">5 seconds</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chart Density</p>
                <p className="text-sm text-muted-foreground">Information density level</p>
              </div>
              <Badge variant="secondary">High</Badge>
            </div>
          </div>
        </Card>

        {/* Algorithm Settings */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold mb-4">Algorithm Parameters</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Value Area Percentage</p>
                <p className="text-sm text-muted-foreground">Percentage of volume for VA calculation</p>
              </div>
              <Badge variant="secondary">70%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Z-Score Threshold</p>
                <p className="text-sm text-muted-foreground">Sensitivity for divergence detection</p>
              </div>
              <Badge variant="secondary">2.5σ</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Block Lookback</p>
                <p className="text-sm text-muted-foreground">Bars to analyze for OB detection</p>
              </div>
              <Badge variant="secondary">50</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Confidence Threshold</p>
                <p className="text-sm text-muted-foreground">Minimum confidence for signal generation</p>
              </div>
              <Badge variant="secondary">65%</Badge>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Signal Alerts</p>
                <p className="text-sm text-muted-foreground">Notify on new trading signals</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Divergence Alerts</p>
                <p className="text-sm text-muted-foreground">Notify on delta divergence</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound Notifications</p>
                <p className="text-sm text-muted-foreground">Play sound on alerts</p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
          </div>
        </Card>

        {/* Data Settings */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold mb-4">Data & Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Source</p>
                <p className="text-sm text-muted-foreground">Primary exchange for data</p>
              </div>
              <Badge variant="secondary">Binance Futures</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Historical Data</p>
                <p className="text-sm text-muted-foreground">Retention period for analysis</p>
              </div>
              <Badge variant="secondary">30 days</Badge>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="default">Save Settings</Button>
          <Button variant="outline">Reset to Defaults</Button>
        </div>

        {/* About Section */}
        <Card className="p-6 border border-border bg-card/50">
          <h2 className="text-lg font-bold mb-2">About</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Crypto Quant Dashboard v1.0.0</strong>
            </p>
            <p>
              An interactive platform for crypto futures market analysis powered by Auction Market Theory,
              Smart Money Concepts, and Order Flow analysis.
            </p>
            <p className="pt-2">
              Built with React, Tailwind CSS, and Recharts. Data sourced from major crypto exchanges.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
