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
      <div className="container">
        <div className="columns">
          <div className="columns col-10 col-xl-9">
            <div className="col-6 col-lg-12">
              <ChartHeaderContainer />
              <ChartContainer />
            </div>
            <div className="col-6 col-lg-12">
              <CardHeader position={'topCenter'} contentOptions={['Price', 'Depth']}/>
              <DepthChartContainer position={'topCenter'} />
              <WebsocketChartContainer position={'topCenter'} />
            </div>
          </div>
          <div className="col-2 col-xl-3">
            <CardHeader position={'topRight'} contentOptions={['Order Book', 'Log']}/>
            <LogContainer position={'topRight'} />
            <OrderBookContainer position={'topRight'} />
          </div>
          <ScratchpadContainer />
        </div>
      </div>
    );
}
