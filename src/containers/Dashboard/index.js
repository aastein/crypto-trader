import React from 'react';

import ChartHeaderContainer from '../ChartHeader';
import ChartContainer from '../Chart';
import WebsocketChartContainer from '../WebsocketChart';
import LogContainer from '../Log';
import OrderBookContainer from '../Orderbook';
import ScratchpadContainer from '../Scratchpad';
import CardHeader from '../CardHeader';
import DepthChartContainer from '../DepthChart';

export const Dashboard = () => {
    console.log('rendering dashboard');
    return (
      <div className="dashboard">
        <div className="top-container">
          <div className="left-container">
            <ChartHeaderContainer />
            <div className="chart-container">
              <ChartContainer />
              <DepthChartContainer />
            </div>
          </div>
          <div className="right-container">
            <CardHeader position={'topRight'} contentOptions={['Order Book', 'Log']}/>
            <LogContainer position={'topRight'} />
            <OrderBookContainer position={'topRight'} />
          </div>
        </div>
        <ScratchpadContainer />
      </div>
    );
}
