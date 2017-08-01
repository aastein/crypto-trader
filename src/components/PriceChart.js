import React, { Component } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import PropTypes from 'prop-types';

export default class PriceChart extends Component {

  componentWillReceiveProps = (nextProps) => {
    if (this.chart) {
      const chart = this.chart.getChart();
      const changedAxisLineIds = this.axisLinesChangedIds(nextProps);

      // update series data
      if (this.dataChanged(nextProps)) {
        for (let i = 0; i < chart.series.length; i += 1) {
          if (nextProps.config.series[i]) {
            chart.series[i].setData(nextProps.config.series[i].data);
          }
        }
      }

      // update series y-axis plot lines
      if (changedAxisLineIds.length > 0) {
        for (let i = 0; i < chart.yAxis.length; i += 1) {
          const chartY = chart.yAxis[i];
          if (chartY.plotLinesAndBands && chartY.plotLinesAndBands[0] && changedAxisLineIds.includes(chartY.plotLinesAndBands[0].id)) {
            // find eqivalent axis in new props
            let nextY;
            for (let j = 0; j < nextProps.config.yAxis.length; j += 1) {
              nextY = nextProps.config.yAxis[i];
              if (nextY.plotLines && nextY.plotLines[0] && nextY.plotLines[0].id.includes(chartY.plotLinesAndBands[0].id)) {
                break;
              }
            }
            // remove plotlines from axis
            chartY.removePlotLine(chartY.plotLinesAndBands[0].id);
            // add plot lines from eqivalent axis to chart
            for (let j = 0; j < nextY.plotLines.length; j += 1) {
              chart.yAxis[i].addPlotLine(nextY.plotLines[j]);
            }
          }
        }
      }

      // update x-axis plot lines
      if (this.testDataChanged(nextProps)) {
        chart.xAxis[0].removePlotLine('testResult');
        for (let i = 0; i < nextProps.config.xAxis.plotLines.length; i += 1) {
          chart.xAxis[0].addPlotLine(nextProps.config.xAxis.plotLines[i]);
        }
      }
    }
  }

  // TODO: this should always be fale. Should instead use highcharts api to change data and redraw.
  // update if config name changed, series length, or yAxis length changed
  shouldComponentUpdate = nextProps => (
    this.props.config.series[0].name !== nextProps.config.series[0].name ||
    this.props.config.yAxis.length !== nextProps.config.yAxis.length ||
    this.props.config.series.length !== nextProps.config.series.length
  )

  dataChanged = (nextProps) => {
    if (this.props.config.series.length !== nextProps.config.series.length) {
      return true;
    }
    for (let i = 0; i < this.props.config.series.length; i += 1) {
      if (this.props.config.series[i].name !== nextProps.config.series[i].name ||
      JSON.stringify(this.props.config.series[i].data) !== JSON.stringify(nextProps.config.series[i].data)) {
        return true;
      }
    }
    return false;
  }

  testDataChanged = nextProps => (
    JSON.stringify(this.props.config.xAxis.plotLines)
    !== JSON.stringify(nextProps.config.xAxis.plotLines)
      || this.props.config.xAxis.plotLines.length !== nextProps.config.xAxis.plotLines.length
  )

  axisLinesChangedIds = (nextProps) => {
    const changedIds = [];
    for (let i = 0; i < nextProps.config.yAxis.length; i += 1) {
      if (this.props.config.yAxis[i]) {
        if (JSON.stringify(nextProps.config.yAxis[i].plotLines) !== JSON.stringify(this.props.config.yAxis[i].plotLines)) {
          if (this.props.config.yAxis[i].plotLines[0]) {
            changedIds.push(this.props.config.yAxis[i].plotLines[0].id);
          }
        }
      }
    }
    return changedIds;
  }

  render() {
    console.log('price chart rendering');
    return (
      <div className="price-chart chart">
        <ReactHighstock config={this.props.config} ref={(c) => { this.chart = c; }} />
      </div>
    );
  }
}


PriceChart.propTypes = {
  config: PropTypes.object.isRequired,
};
