import React from 'react';

import Loader from '../../../components/Loader';
import PriceChart from '../../../components/PriceChart';

const Chart = ({ chart, scripts, profile, appendLog, updateAccounts }) => {
  const selectedProduct = chart.products.length > 0 ?
    chart.products.reduce((a, p) => (p.active ? p : a), {}) : {};

  const selectedProductPriceData = selectedProduct.data ?
    selectedProduct.data.map(d => ([d.time, d.open, d.high, d.low, d.close])) : [];

  const selectedProductVolumeData = selectedProduct.data ?
    selectedProduct.data.map(d => ([d.time, d.volume])) : [];

  const selectedProductIndicatorKData = selectedProduct.srsi ?
    selectedProduct.srsi.map(d => ([d.time, d.k])) : [];

  const selectedProductIndicatorDData = selectedProduct.srsi ?
    selectedProduct.srsi.map(d => ([d.time, d.d])) : [];

  const selectedProductIndicatorMetaKData = selectedProduct.metasrsi ?
  selectedProduct.metasrsi.map(d => ([d.time, d.k])) : [];

  const selectedProductIndicatorMetaDData = selectedProduct.metasrsi ?
    selectedProduct.metasrsi.map(d => ([d.time, d.d])) : [];

  const selectedProductRSIData = selectedProduct.rsi ?
    selectedProduct.rsi.map(d => ([d.time, d.value])) : [];

  const selectedProductCCIData = selectedProduct.cci ?
    selectedProduct.cci.map(d => ([d.time, d.value])) : [];

  const testPlotLines = chart.testResult.data ? chart.testResult.data.map(d => (
    { id: 'testResult',
      value: d.time,
      width: 2,
      color: d.balance < 0 ? 'green' : 'red',
      dashStyle: d.loss ? 'dot' : 'solid',
      label: {
        text: d.label,
        verticalAlign: 'top',
        textAlign: 'left',
        rotation: 0,
      },
    })) : [];

  const config = {
    chart: {
      marginBottom: 15,
    },
    navigator: {
      height: 10,
    },
    rangeSelector: {
      enabled: false,
    },
    xAxis: {
      plotLines: testPlotLines,
    },
    yAxis: [{
      labels: {
        align: 'right',
        x: -3,
      },
      height: '60%',
      lineWidth: 2,
    },
    {
      labels: {
        align: 'right',
        x: -3,
      },
      top: '40%',
      height: '20%',
      offset: 0,
      lineWidth: 2,
    },
    {
      labels: {
        align: 'right',
        x: -3,
      },
      top: '62%',
      height: '17%',
      lineWidth: 2,
      max: 1,
      min: 0,
      plotLines: [{
        value: 0.8,
        color: 'red',
        width: 1,
      }, {
        value: 0.2,
        color: 'red',
        width: 1,
      }],
    },
    {
      labels: {
        align: 'right',
        x: -3,
      },
      top: '80%',
      height: '10%',
      lineWidth: 2,
      softMax: 100,
      softMin: 0,
      plotLines: [{
        value: 70,
        color: 'red',
        width: 1,
      }, {
        value: 30,
        color: 'red',
        width: 1,
      }],
    },
    {
      labels: {
        align: 'right',
        x: -3,
      },
      top: '90%',
      height: '10%',
      lineWidth: 2,
      max: 400,
      min: -400,
      plotLines: [{
        value: 100,
        color: 'red',
        width: 1,
      }, {
        value: -100,
        color: 'red',
        width: 1,
      }],
    }],
    series: [{
      name: selectedProduct.display_name,
      data: selectedProductPriceData,
      type: 'candlestick',
      tooltip: {
        valueDecimals: 2,
      },
      dataGrouping: {
        enabled: false,
      },
    },
    {
      type: 'column',
      name: 'Volume',
      dataGrouping: {
        enabled: false,
      },
      data: selectedProductVolumeData,
      yAxis: 1,
    },
    {
      data: selectedProductIndicatorKData,
      type: 'line',
      name: 'k',
      tooltip: {
        valueDecimals: 2,
      },
      yAxis: 2,
      dataGrouping: {
        enabled: false,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
    },
    {
      data: selectedProductIndicatorDData,
      type: 'line',
      name: 'd',
      tooltip: {
        valueDecimals: 2,
      },
      yAxis: 2,
      lineWidth: 1,
      dataGrouping: {
        enabled: false,
      },
      states: {
        hover: {
          lineWidth: 1,
        },
      },
    },
    {
      data: selectedProductIndicatorMetaKData,
      type: 'line',
      name: 'metaK',
      tooltip: {
        valueDecimals: 2,
      },
      yAxis: 2,
      lineWidth: 1,
      dataGrouping: {
        enabled: false,
      },
      states: {
        hover: {
          lineWidth: 1,
        },
      },
    },
    {
      data: selectedProductIndicatorMetaDData,
      type: 'line',
      name: 'metaD',
      tooltip: {
        valueDecimals: 2,
      },
      yAxis: 2,
      lineWidth: 1,
      dataGrouping: {
        enabled: false,
      },
      states: {
        hover: {
          lineWidth: 1,
        },
      },
    },
    {
      data: selectedProductRSIData,
      type: 'line',
      name: 'rsi',
      tooltip: {
        valueDecimals: 2,
      },
      yAxis: 3,
      dataGrouping: {
        enabled: false,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
    },
    {
      data: selectedProductCCIData,
      type: 'line',
      name: 'cci',
      tooltip: {
        valueDecimals: 2,
      },
      yAxis: 4,
      dataGrouping: {
        enabled: false,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
    }],
    scrollbar: {
      enabled: false,
    },
    pane: {
      background: {
        borderWidth: 0,
      },
    },
  };

  return (
    <div className="price-chart-container">
      { selectedProduct.data && selectedProduct.data.length > 0 ?
        <div>
          <PriceChart
            config={config}
            chart={chart}
            scripts={scripts}
            profile={profile}
            appendLog={appendLog}
            updateAccounts={updateAccounts}
          />
        </div>
        : <div>
          <Loader />
        </div>
    }
    </div>
  );
};

export default Chart;
