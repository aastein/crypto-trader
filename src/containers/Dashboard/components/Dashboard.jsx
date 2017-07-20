import React, { Component } from 'react';

import ChartHeader from './ChartHeader';
import Chart from './Chart';
import WebsocketChart from './WebsocketChart';
import Scratchpad from './Scratchpad';
import Log from './Log';

export default class Dashboard extends Component {

  componentDidMount() {
    this.props.setLocation(this.props.location);
  }

  render() {
    return (
      <div className="dashboard">
        <div className="top-container">
          <div className="left-container">
            <ChartHeader
              chart={this.props.chart}
              selectedProductIds={this.props.profile.selectedProducts.map(p => (p.value))}
              websocket={this.props.websocket}
              fetchProductData={this.props.fetchProductData}
              selectProduct={this.props.selectProduct}
              setGanularity={this.props.setGranularity}
              setProductData={this.props.setProductData}
              selectIndicator={this.props.selectIndicator}
              editIndicator={this.props.editIndicator}
              selectDateRange={this.props.selectDateRange}
              setProducts={this.props.setProducts}
              setProductWSData={this.props.setProductWSData}
              setFetchingStatus={this.props.setFetchingStatus}
            />
            <div className="chart-container">
              <Chart
                chart={this.props.chart}
              />
              <WebsocketChart
                scripts={this.props.scripts}
                profile={this.props.profile}
                products={this.props.chart.products}
                websocket={this.props.websocket}
                addOrder={this.props.addOrder}
                appendLog={this.props.appendLog}
                addProductData={this.props.addProductData}
                setProductData={this.props.setProductData}
                setProductWSData={this.props.setProductWSData}
              />
            </div>
          </div>
          <div className="right-container">
            <Log log={this.props.log} />
          </div>
        </div>
        <Scratchpad
          className="bottom-container"
          scripts={this.props.scripts}
          products={this.props.chart.products}
          profile={this.props.profile}
          addOrder={this.props.addOrder}
          addScript={this.props.addScript}
          appendLog={this.props.appendLog}
          saveScript={this.props.saveScript}
          deleteScript={this.props.deleteScript}
          saveTestResult={this.props.saveTestResult}
          selectScript={this.props.selectScript}
          selectProductDoc={this.props.selectProductDoc}
          toggleScriptLive={this.props.toggleScriptLive}
          updateAccounts={this.props.updateAccounts}
        />
      </div>
    );
  }
}
