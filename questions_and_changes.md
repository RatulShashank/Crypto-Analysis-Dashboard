# Dashboard-New Requirements and Changes

Please provide your answers to the following questions, and list out the specific changes you want implemented in this new dashboard.

## Questions

1. **Scope of the new dashboard**: Do you want to keep the exact same features and pages (Dashboard, Analysis, Signals, Settings) or should some be removed/added?
-Yes keep these pages in the new dashboard. 
2. **Design and Theme**: The current project uses a dark theme with shadcn/ui. Should the new dashboard keep this aesthetic or do you want a different color palette / style?
-Keep the same aesthetic as the old dashboard, but with a lighter background and dark text. Make the charts more interactive and visually appealing.
3. **Backend Integration**: Should the new dashboard point to the same Express backend, or will it require new backend endpoints?
-We will be making a few changes to the new dashboard in how it takes data. 
4. **Data Sources**: Will the new dashboard be pulling from the same data structures (kline, order flow, trades), or do we need to implement new data schemas?
-Will be using a new backend with new data structures. It will still use the same kind of data but the backend and how it processes it will be different. 

## Requested Changes

*Please list the specific changes you want made to the replicated project here:*

- [ ] Change 1: We will give the two types of data sources to perform the analyis. One will be Using an API key that the user can give to fetch real-time market data. Another is from data sets that the user can give the path to. When the dashboard is launched check if the api key is given or not. If not then ask for the location of the data sets. You can read all the data from the folder. Give options to which datasets can be given, Klines is mandatory. Other datasets include aggTrades, bookDepth, metrics, funding_rates. I have provided with the datasets in the folder called Datasets, look at the rows and columns and understand the data structure and use it accordingly. The datasets are for BTC/USDT, keep this symbol as default unless user specified and provides data for other symbols. APIs can use different data structures so if the docs website on how to use the API is not available then ask for it. 
- [ ] Change 2: Based on the data given perform the analysis. There is an ANALYSIS_PLAN in the location G:\VINCI-vault\quant-research. Use the plan to perform the analysis. Display the output in the dashboard in a way that is easy to understand and interpret. Show all the visual outputs in the dashboard itself. Use Python scripts to perform analysis and give the output in a way that can be displayed in the dashboard. 
- [ ] Change 3: Ask for what analysis to perfrom after the data is loaded. Use the ANALYSIS_PLAN to give options to the user about what analysis you can perform. Also Use Funding Rates and OI data in the key zones to identify Bullish/Bearish pressure. Ask for the time range for the analysis. Check if the available datasets (that the user flaged to use in the analysis and has given path/api key to) have the required data for the analysis. If not then ask the user to provide the data in the time range or choose another time for analysis. If AggTrades are no given then use the formula delta_vol = 2 * taker_buy_vol - total_vol in the data of Klines to calculate delta_vol and then eventually create a Delta Vol proxy for analysis.
