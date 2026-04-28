import pandas as pd
import numpy as np

class QuantAnalysisEngine:
    def __init__(self, data: dict):
        self.kline_df = data.get('kline')
        self.agg_df = data.get('aggTrades')
        
        # Ensure datetime format
        if self.kline_df is not None and not self.kline_df.empty:
            self.kline_df['datetime'] = pd.to_datetime(self.kline_df['open_time'], unit='ms', utc=True)
            self.kline_df.set_index('datetime', inplace=True)

    def calculate_session_metrics(self) -> dict:
        """
        Calculates the session highs, lows, and potential biases as per ANALYSIS_PLAN.
        Asia: 00:00-07:59 UTC
        London: 08:00-15:59 UTC
        NY: 13:00-21:59 UTC
        """
        if self.kline_df is None or self.kline_df.empty:
            return {"error": "No Kline data available for session analysis"}

        df = self.kline_df.copy()
        
        # Group by day
        daily_groups = df.groupby(df.index.date)
        
        session_results = []
        for date, day_df in daily_groups:
            # Asia Session
            asia = day_df.between_time('00:00', '07:59')
            london = day_df.between_time('08:00', '15:59')
            ny = day_df.between_time('13:00', '21:59')
            
            metrics = {'date': str(date)}
            
            if not asia.empty:
                metrics['asia_high'] = asia['high'].max()
                metrics['asia_low'] = asia['low'].min()
                metrics['asia_range'] = metrics['asia_high'] - metrics['asia_low']
            
            if not london.empty:
                metrics['london_high'] = london['high'].max()
                metrics['london_low'] = london['low'].min()
                
            if not ny.empty:
                metrics['ny_high'] = ny['high'].max()
                metrics['ny_low'] = ny['low'].min()
                
            # Daily bias estimation based on sweeps (simplified logic)
            # If London sweeps Asia high but closes back inside: Bearish bias
            # This logic will be fleshed out fully in the production version.
            session_results.append(metrics)
            
        return session_results[-10:] # Return last 10 days for the dashboard
        
    def calculate_volume_profile(self) -> dict:
        """
        Calculates Volume Profile, POC, VAH, VAL for the most recent day.
        """
        if self.kline_df is None or self.kline_df.empty:
            return {"error": "No Kline data available"}
            
        # Get the last 24 hours of data
        last_day_df = self.kline_df.last('1D')
        
        # Create price bins
        min_price = last_day_df['low'].min()
        max_price = last_day_df['high'].max()
        
        if pd.isna(min_price) or pd.isna(max_price):
            return {}
            
        bins = np.linspace(min_price, max_price, 50)
        
        # Calculate volume per bin
        # A simple approximation using typical price (H+L+C)/3
        last_day_df['typical_price'] = (last_day_df['high'] + last_day_df['low'] + last_day_df['close']) / 3
        
        last_day_df['price_bin'] = pd.cut(last_day_df['typical_price'], bins=bins)
        vol_profile = last_day_df.groupby('price_bin', observed=False)['volume'].sum()
        
        # Find Point of Control (POC)
        poc_bin = vol_profile.idxmax()
        poc_price = poc_bin.mid if pd.notna(poc_bin) else 0
        
        # Calculate Value Area (70% of volume)
        total_vol = vol_profile.sum()
        target_vol = total_vol * 0.70
        
        # Sort bins by volume descending
        sorted_profile = vol_profile.sort_values(ascending=False)
        
        cum_vol = 0
        value_area_bins = []
        for b, v in sorted_profile.items():
            cum_vol += v
            value_area_bins.append(b)
            if cum_vol >= target_vol:
                break
                
        if value_area_bins:
            vah = max(b.right for b in value_area_bins)
            val = min(b.left for b in value_area_bins)
        else:
            vah, val = 0, 0
            
        # Format profile for charting
        profile_data = []
        for b, v in vol_profile.items():
            profile_data.append({
                "price": b.mid,
                "volume": float(v)
            })
            
        return {
            "poc": float(poc_price),
            "vah": float(vah),
            "val": float(val),
            "profile": profile_data
        }
        
    def calculate_statistics(self) -> dict:
        if self.kline_df is None or self.kline_df.empty:
            return {}
            
        close_prices = self.kline_df['close']
        returns = close_prices.pct_change().dropna()
        
        # Mean and Std Dev
        mean_price = close_prices.mean()
        std_dev = close_prices.std()
        
        # Skewness and Kurtosis of returns
        skewness = returns.skew()
        kurtosis = returns.kurtosis()
        
        # Generate some rolling volatility for the chart (last 100 periods)
        rolling_vol = returns.rolling(window=10).std() * (24**0.5) * 100 # Rough annualized proxy
        zscores = (close_prices - close_prices.rolling(window=20).mean()) / close_prices.rolling(window=20).std()
        
        recent_df = self.kline_df.tail(100).copy()
        recent_df['volatility'] = rolling_vol.tail(100)
        recent_df['zscore'] = zscores.tail(100)
        recent_df.reset_index(inplace=True)
        
        vol_data = []
        for _, row in recent_df.iterrows():
            if pd.notna(row['volatility']) and pd.notna(row['zscore']):
                vol_data.append({
                    'time': str(row['datetime']).split(' ')[1][:5] if ' ' in str(row['datetime']) else str(row['datetime']),
                    'volatility': float(row['volatility']),
                    'zscore': float(row['zscore'])
                })
                
        return {
            "mean_price": float(mean_price),
            "std_dev": float(std_dev),
            "skewness": float(skewness),
            "kurtosis": float(kurtosis),
            "volatility_data": vol_data
        }
        
    def generate_dashboard_payload(self) -> dict:
        """
        Runs all analyses and aggregates into a single dict for the frontend.
        """
        payload = {
            "sessions": self.calculate_session_metrics(),
            "volume_profile": self.calculate_volume_profile(),
            "statistics": self.calculate_statistics()
        }
        
        # Add basic kline data for chart (last 100 candles)
        if self.kline_df is not None and not self.kline_df.empty:
            recent_klines = self.kline_df.tail(100).reset_index()
            # Convert datetime back to string for JSON serialization
            recent_klines['datetime'] = recent_klines['datetime'].astype(str)
            payload['chart_data'] = recent_klines[['datetime', 'open', 'high', 'low', 'close', 'volume', 'delta_vol']].to_dict(orient='records')
            
        return payload
