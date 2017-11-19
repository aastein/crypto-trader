import { connect } from 'react-redux';
import React, { Component } from 'react';

import Loader from '../../components/Loader';
import PriceChart from '../../components/PriceChart';
import { round } from '../../utils/math';

class Chart extends Component {

  inidcatorYAxis = (top, height, chartMin, chartMax, axisLines, id) => (
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
      plotLines: axisLines ? axisLines.map(v => (
        {
          id,
          value: v,
          color: 'red',
          width: 1,
        }
      )) : [],
    }
  )

  indicatorSeries = (selectedIndicatorsData, indicator, yAxisNumber) => {
    const seriesData = indicator.valueIds.map(id => (
      {
        data: selectedIndicatorsData[indicator.id].map(d => (
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

  indicatorConfig = (selectedIndicatorsData, indicator, reservedHeight, numIndicators, axisIndex) => {
    if (indicator.renderOnMain) {
      return {
        series: this.indicatorSeries(selectedIndicatorsData, indicator, 0),
      };
    }

    const height = ((100 - reservedHeight) / numIndicators);
    const top = 100 - (height * (axisIndex));

    return {
      yAxis: this.inidcatorYAxis(`${top}%`, `${height}%`, indicator.chartMin, indicator.chartMax, indicator.axisLines, indicator.id),
      series: this.indicatorSeries(selectedIndicatorsData, indicator, axisIndex + 1),
    };
  }


  indicatorConfigs = (selectedIndicatorsData, indicators) => {
    const reservedHeight = 60;
    const greatestReservedAxisIndex = 1;
    let greatestAxisIndex = greatestReservedAxisIndex;
    let config = { yAxis: [], series: [] };
    const numIndicators = indicators.reduce((a, b) => (!b.renderOnMain ? a + 1 : a), 0);
    for (let i = 0; i < indicators.length; i += 1) {
      const indConf = this.indicatorConfig(selectedIndicatorsData, indicators[i], reservedHeight, numIndicators, greatestAxisIndex);
      if (indConf.yAxis) greatestAxisIndex += 1;
      config = {
        yAxis: indConf.yAxis ? [...config.yAxis, indConf.yAxis] : config.yAxis,
        series: [...config.series, ...indConf.series],
      };
    }
    return config;
  }

  render() {
    console.log('rendering chart container');
    const indicatorConfigs = this.indicatorConfigs(this.props.selectedIndicatorsData, this.props.selectedIndicators);

    const testPlotLines = this.props.testResultData ? this.props.testResultData.map((d, i) => (
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
      }),
    ) : [];

    const candleStickConfig = {
      yAxis: {
        labels: {
          align: 'left',
          x: 5,
        },
        height: indicatorConfigs.yAxis.length > 0 ? '50%' : '90%',
        lineWidth: 1,
        floor: 0,
      },
      series: {
        name: this.props.productDisplayName,
        data: this.props.priceData,
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
        top: indicatorConfigs.yAxis.length > 0 ? '50%' : '90%',
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
        data: this.props.volumeData,
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
        { this.props.priceData && this.props.priceData.length > 0 ?
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

const mapStateToProps = state => {

  const selectedProduct = state.chart.products.find(p => {
    return p.active;
  });

  const productDisplayName = selectedProduct ? selectedProduct.display_name : '';

  const selectedIndicators = state.chart.indicators.filter(i => (i.active));

  const selectedIndicatorsData = selectedIndicators.reduce((ids, i) => {
    ids = [ ...ids, i.id ];
    return ids;
  }, []).map(id => {
    return selectedProduct[id];
  });

  const selectedProductPriceData = selectedProduct && selectedProduct.data ?
      selectedProduct.data.map(d => ([d.time, d.open, d.high, d.low, d.close])) : [];

  const selectedProductVolumeData = selectedProduct && selectedProduct.data ?
      selectedProduct.data.map(d => ([d.time, round(d.volume, 2)])) : [];

  const testResultData = state.chart.testResult.data;

  return ({
    productDisplayName,
    selectedIndicators,
    selectedIndicatorsData,
    testResultData,
    selectedProductPriceData,
    selectedProductVolumeData,
  })
};

const ChartContainer = connect(
  mapStateToProps,
  null,
)(Chart);

export default ChartContainer;
