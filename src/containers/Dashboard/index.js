import React from 'react';

import ChartHeaderContainer from '../ChartHeader';
import ChartContainer from '../Chart';
import WebsocketChartContainer from '../WebsocketChart';
import LogContainer from '../Log';
import OrderBookContainer from '../Orderbook';
import ScratchpadContainer from '../Scratchpad';
import CardHeader from '../CardHeader';
import DepthChartContainer from '../DepthChart';
import ManualOrderContainer from '../ManualOrder';
import ProductDataListContainer from '../ProductDataList';
import OrderHistoryContainer from '../OrderHistory';

export const Dashboard = () => {
  // console.log('rendering dashboard');
  return (
    <div className="flex-1 flex-column container third-bg-dark">
      <div className="container">
        <div className="columns">
          <div className="col-10 col-xl-9">
            <div className="container">
              <div className="columns px-1">
                <div className="col-6 col-xl-12">
                  <ChartHeaderContainer />
                  <ChartContainer />
                </div>
                <div className="col-6 col-xl-12">
                  <CardHeader position={'topCenter'} contentOptions={['Price', 'Depth']}/>
                  <DepthChartContainer position={'topCenter'} />
                  <WebsocketChartContainer position={'topCenter'} />
                </div>
              </div>
            </div>
          </div>
          <div className="secondary-bg-dark col-2 col-xl-3">
            <CardHeader position={'topRight'} contentOptions={['Order Book', 'Log']}/>
            <LogContainer position={'topRight'} />
            <OrderBookContainer position={'topRight'} />
          </div>
        </div>
      </div>
      <div className="container flex-column flex-1">
        <div className="flex-1 columns">
          <div className="container flex-column col-8">
            <CardHeader position={'bottomLeft'} contentOptions={['Scripts', 'Orders']}/>
            <ScratchpadContainer className="container flex-1 d-flex" position={'bottomLeft'}/>
            <OrderHistoryContainer className="container flex-1 d-flex" position={'bottomLeft'}/>
          </div>
          <div className="container col-4">
            <CardHeader position={'bottomRight'} contentOptions={['Trade', 'Product Data']}/>
            <ManualOrderContainer position={'bottomRight'}/>
            <ProductDataListContainer position={'bottomRight'}/>
          </div>
        </div>
      </div>
    </div>
  );
}
