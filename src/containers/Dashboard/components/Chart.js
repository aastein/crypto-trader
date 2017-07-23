import React, { Component } from 'react';

import Loader from '../../../components/Loader';
import PriceChart from '../../../components/PriceChart';
import { round } from '../../../utils/math';

export default class Chart extends Component {

  // only render if chart data changed or test data
  shouldComponentUpdate(nextProps, nextState) {
    const dataChanged = JSON.stringify(this.selectedProduct(this.props).data)
      !== JSON.stringify(this.selectedProduct(nextProps).data);
    const testDataChanged = JSON.stringify(this.props.chart.testResult.data)
      !== JSON.stringify(nextProps.chart.testResult.data);
    return dataChanged || testDataChanged;
  }

  selectedProduct = props => (
    props.chart.products.length > 0 ?
      props.chart.products.reduce((a, p) => (p.active ? p : a), {}) : {}
  )

  inidcatorYAxis = (top, height, chartMin, chartMax, axisLines) => (
    {
      labels: {
        align: 'left',
        x: 5,
      },
      offset: 0,
      top,
      height,
      lineWidth: 1,
      min: chartMin,
      max: chartMax,
      plotLines: axisLines.map(v => (
        {
          value: v,
          color: 'red',
          width: 1,
        }
      )),
    }
  )

  indicatorSeries = (product, indicator, yAxisNumber) => {
    if (product[indicator.id]) {
      const seriesData = indicator.valueIds.map(id => (
        {
          data: product[indicator.id].map(d => (
            [d.time, d[id]]
          )),
          name: id,
        }
      ));
      return seriesData.map(d => (
        {
          data: d.data,
          type: 'line',
          name: d.name,
          tooltip: {
            valueDecimals: 2,
          },
          yAxis: yAxisNumber,
          dataGrouping: {
            enabled: false,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
        }
      ));
    }
    return [];
  }

  indicatorConfig = (product, indicator, reservedHeight, numIndicators, index) => {
    if (indicator.renderOnMain) {
      return {
        series: this.indicatorSeries(product, indicator, 0),
      };
    }
    const top = `${100 - (((100 - reservedHeight) / numIndicators) * (index + 1))}%`;
    const height = `${((100 - reservedHeight) / numIndicators)}%`;
    return {
      yAxis: this.inidcatorYAxis(top, height, indicator.chartMin, indicator.chartMax, indicator.axisLines),
      series: this.indicatorSeries(product, indicator, index + 2),
    };
  }


  indicatorConfigs = (product, indicators) => {
    const reservedHeight = 60;
    let config = { yAxis: [], series: [] };
    const numIndicators = indicators.reduce((a, b) => (!b.renderOnMain ? a + 1 : a), 0);
    for (let i = 0; i < indicators.length; i += 1) {
      const indConf = this.indicatorConfig(product, indicators[i], reservedHeight, numIndicators, i);
      config = {
        yAxis: indConf.yAxis ? [...config.yAxis, indConf.yAxis] : config.yAxis,
        series: [...config.series, ...indConf.series],
      };
    }
    return config;
  }

  render() {
    const selectedProduct = this.selectedProduct(this.props);
    const activeIndicators = this.props.chart.indicators.filter(i => (i.active));
    const indicatorConfigs = this.indicatorConfigs(selectedProduct, activeIndicators);
    const selectedProductPriceData = selectedProduct.data ?
      selectedProduct.data.map(d => ([d.time, d.open, d.high, d.low, d.close])) : [];
    const selectedProductVolumeData = selectedProduct.data ?
      selectedProduct.data.map(d => ([d.time, round(d.volume, 2)])) : [];

    const testPlotLines = this.props.chart.testResult.data ? this.props.chart.testResult.data.map((d, i) => (
      { id: 'testResult',
        value: d.time,
        width: 2,
        color: d.price < 0 ? 'green' : 'red',
        dashStyle: d.loss ? 'dot' : 'solid',
        label: {
          text: d.label,
          verticalAlign: 'top',
          textAlign: 'left',
          rotation: 0,
          y: (i % 4) * 10,
        },
      })) : [];

    const candleStickConfig = {
      yAxis: {
        labels: {
          align: 'left',
          x: 5,
        },
        height: '50%',
        lineWidth: 1,
      },
      series: {
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
    };

    const volumeConfig = {
      yAxis: {
        labels: {
          enabled: false,
        },
        top: '50%',
        height: '10%',
        offset: 0,
        lineWidth: 1,
      },
      series: {
        type: 'column',
        name: 'Volume',
        dataGrouping: {
          enabled: false,
        },
        data: selectedProductVolumeData,
        yAxis: 1,
      },
    };

    const config = {
      chart: {
        marginBottom: 15,
      },
      credits: {
        enabled: false,
      },
      navigator: {
        height: 10,
        xAxis: {
          labels: {
            y: 13,
          },
        },
      },
      rangeSelector: {
        enabled: false,
      },
      xAxis: {
        plotLines: testPlotLines,
        labels: {
          y: 13,
        },
        tickLength: 3,
      },
      yAxis: [
        candleStickConfig.yAxis,
        volumeConfig.yAxis,
        ...indicatorConfigs.yAxis,
      ],
      series: [
        candleStickConfig.series,
        volumeConfig.series,
        ...indicatorConfigs.series,
      ],
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
            />
          </div>
          : <div>
            <Loader />
          </div>
      }
      </div>
    );
  }
}
