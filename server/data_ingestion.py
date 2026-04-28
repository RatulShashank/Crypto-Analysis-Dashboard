import os
import glob
import pandas as pd
from typing import Optional, Dict

class DataIngestionEngine:
    def __init__(self, data_source_type: str, kline_path: Optional[str] = None, 
                 oi_path: Optional[str] = None, funding_path: Optional[str] = None,
                 api_key: Optional[str] = None, start_date: Optional[str] = None, 
                 end_date: Optional[str] = None):
        self.data_source_type = data_source_type
        self.kline_path = kline_path
        self.oi_path = oi_path
        self.funding_path = funding_path
        self.api_key = api_key
        self.start_date = start_date
        self.end_date = end_date

    def _filter_by_date(self, df: pd.DataFrame, time_col: str = 'datetime') -> pd.DataFrame:
        """Filters DataFrame based on start_date and end_date."""
        if df.empty or time_col not in df.columns:
            return df
            
        if self.start_date:
            df = df[df[time_col] >= pd.to_datetime(self.start_date, utc=True)]
        if self.end_date:
            # Add one day to end_date to make it inclusive of that day
            end = pd.to_datetime(self.end_date, utc=True) + pd.Timedelta(days=1)
            df = df[df[time_col] < end]
            
        return df

    def load_yfinance_data(self, symbol: str) -> pd.DataFrame:
        import yfinance as yf
        
        # Map Binance format to yfinance format (e.g. BTCUSDT -> BTC-USD)
        if symbol.endswith("USDT"):
            yf_symbol = symbol.replace("USDT", "-USD")
        else:
            yf_symbol = symbol
            
        # Download data
        df = yf.download(yf_symbol, start=self.start_date, end=self.end_date, interval="1h")
        if df.empty:
            raise ValueError(f"No data returned from yfinance for {yf_symbol}")
            
        # Flatten multi-index columns if present
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [c[0] for c in df.columns]
            
        df.reset_index(inplace=True)
        # Standardize column names
        df.rename(columns={
            'Datetime': 'datetime',
            'Date': 'datetime',
            'Open': 'open',
            'High': 'high',
            'Low': 'low',
            'Close': 'close',
            'Volume': 'volume'
        }, inplace=True)
        
        # Ensure UTC
        if df['datetime'].dt.tz is None:
            df['datetime'] = df['datetime'].dt.tz_localize('UTC')
        else:
            df['datetime'] = df['datetime'].dt.tz_convert('UTC')
            
        # For yfinance, we don't have taker_buy_volume, so delta_vol can't be strictly calculated. 
        # Set to 0 or estimate.
        df['delta_vol'] = 0 
        
        return df

    def load_local_data(self, path: str, type_name: str) -> pd.DataFrame:
        if not path or not os.path.exists(path):
            return pd.DataFrame()
            
        if os.path.isfile(path):
            df = pd.read_csv(path)
        else:
            # It's a directory, load all csvs
            files = glob.glob(os.path.join(path, "*.csv"))
            if not files:
                return pd.DataFrame()
            dfs = [pd.read_csv(f) for f in files]
            df = pd.concat(dfs, ignore_index=True)
            
        # Attempt to parse time to datetime
        time_cols = ['open_time', 'timestamp', 'time']
        for col in time_cols:
            if col in df.columns:
                # heuristic: if huge number, it's ms
                if df[col].dtype in ['int64', 'float64'] and df[col].max() > 1e11:
                    df['datetime'] = pd.to_datetime(df[col], unit='ms', utc=True)
                else:
                    df['datetime'] = pd.to_datetime(df[col], utc=True)
                break
                
        # Sort
        if 'datetime' in df.columns:
            df.sort_values(by='datetime', inplace=True)
            df.reset_index(drop=True, inplace=True)
            # Filter
            df = self._filter_by_date(df)
            
        return df

    def load_all_datasets(self, symbol: str = "BTCUSDT") -> Dict[str, pd.DataFrame]:
        datasets = {}
        
        if self.data_source_type == 'yfinance':
            kline_df = self.load_yfinance_data(symbol)
            datasets['kline'] = kline_df
            return datasets
            
        if self.data_source_type == 'local':
            if not self.kline_path:
                raise ValueError("Kline path is required for local data source.")
                
            kline_df = self.load_local_data(self.kline_path, "Kline")
            if kline_df.empty:
                raise ValueError(f"No Kline data found at {self.kline_path}")
                
            # Calculate delta_vol if possible
            if 'taker_buy_volume' in kline_df.columns and 'volume' in kline_df.columns:
                kline_df['delta_vol'] = (2 * kline_df['taker_buy_volume']) - kline_df['volume']
            elif 'delta_vol' not in kline_df.columns:
                kline_df['delta_vol'] = 0
                
            datasets['kline'] = kline_df
            
            # Load OI and Funding if provided
            if self.oi_path:
                datasets['oi'] = self.load_local_data(self.oi_path, "Open Interest")
            if self.funding_path:
                datasets['funding_rates'] = self.load_local_data(self.funding_path, "Funding Rate")
                
        return datasets
