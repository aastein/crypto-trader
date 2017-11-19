import React from 'react';

import ChartHeaderContainer from '../ChartHeader';
import ChartContainer from '../Chart';
import WebsocketChartContainer from '../WebsocketChart';
import LogContainer from '../Log';
import OrderBookContainer from '../Orderbook';
import ScratchpadContainer from '../Scratchpad';

export const Dashboard = () => {
    console.log('rendering dashboard');
    return (
      <div className="dashboard">
        <div className="top-container">
          <div className="left-container">
            <ChartHeaderContainer />
            <div className="chart-container">
              <ChartContainer />
              <WebsocketChartContainer />
            </div>
          </div>
          <div className="right-container">
            <LogContainer position={'topRight'} />
            <OrderBookContainer position={'topRight'} />
          </div>
        </div>
        <ScratchpadContainer />
      </div>
    );
}
