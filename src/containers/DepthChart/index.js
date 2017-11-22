import React, { Component } from 'react';
import { connect } from 'react-redux';

import LineChart from '../../components/LineChart';
import Loader from '../../components/Loader';
import ConnectedGlyph from '../../components/ConnectedGlyph';

class DepthChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastUpdateTime: Date.now(),
    };
  }

  // return false, do update with child chart API via ref
  shouldComponentUpdate(nextProps) {
    if(this.lineChart && this.lineChart.depthchart && Date.now() - this.state.lastUpdateTime > 1000) {
      const chart = this.lineChart.depthchart.getChart();
      const nextConfig = this.config(nextProps);
      window.chartRef = chart;
      if (this.dataChanged(nextConfig)) {
        for (let i = 0; i < chart.series.length; i += 1) {
          if (nextConfig.series[i]) {
            chart.series[i].update({
              name: nextConfig.series[i].name,
              data: nextConfig.series[i].data,
            });
            // console.log('updating spread eagle chart');
            console.log('');
            this.setState(() => ({
              lastUpdateTime: Date.now(),
            }));
          }
        }
      }
    }
    return (this.props.asks.length === 0 && nextProps.asks.length > 0) || this.props.visible !== nextProps.visible ;
  }

  dataChanged = (nextConfig) => {
    return JSON.stringify(this.config(this.props).series[0].data) !== JSON.stringify(nextConfig.series[0].data)
      || JSON.stringify(this.config(this.props).series[1].data) !== JSON.stringify(nextConfig.series[1].data);
  }

  config = (props) => {
    //console.log('length calc', Math.abs(props.bids[props.bids.length][0] - props.bids[0][0]),
    //  Math.abs(props.asks[props.asks.length][0] - props.asks[0][0]));
    const orderbookHalfLength = Math.max(
      Math.abs(props.bids[props.bids.length - 1][0] - props.bids[0][0]),
      Math.abs(props.asks[props.asks.length - 1][0] - props.asks[0][0]),
    );
    const orderbookCenter = props.asks[0][0] + ((props.asks[0][0] - props.asks[0][0]) / 2);
    const yAxisHeight = Math.ceil(100*props.asks[props.asks.length - 1][1])/100;
    return {
      plotOptions: {
        column: {
          borderWidth: 0,
        }
      },
      title:{
        text: null
      },
      legend: {
        enabled: false,
      },
      rangeSelector: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      chart: {
        type: 'area',
        marginBottom: 51,
        backgroundColor: 'transparent',
      },
      xAxis: [{
        min: Math.floor(100*(orderbookCenter - orderbookHalfLength))/100,
        max: Math.ceil(100*(orderbookCenter + orderbookHalfLength))/100,
        allowDecimals: false,
        labels: {
          y: 13,
        },
        title: { text: null },
        reversed: false,
        tickLength: 3,
        type: 'linear',
      }],
      yAxis: [{
        gridLineColor: 'transparent',
        title: { text: null },
        min: 0,
        max: yAxisHeight,
        allowDecimals: false,
        labels: {
          align: 'right',
          x: -5,
        },
        opposite: true,
        lineWidth: 1,
      },
      {
        gridLineColor: 'transparent',
        title: { text: null },
        min: 0,
        max: 1,
        allowDecimals: false,
        labels: {
          enabled: false
        },
        lineWidth: 0,
      }],
      series: [{
        data: props.bids,
        animation: false,
        tooltip: {
          valueDecimals: 2,
        },
        color: '#4db51c',
        fillOpacity: 0.3,
        yAxis: 0
      },
      {
        data: props.asks,
        animation: false,
        tooltip: {
          valueDecimals: 2,
        },
        color: '#9b3a1a',
        fillOpacity: 0.3,
        yAxis: 0,
      },
      {
        animation: false,
        type: 'column',
        color: 'rgba(255,255,255,0.2)',
        data: [
          [orderbookCenter, 3.5],
        ],
        yAxis: 1,
      }
      ],
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      pane: {
        background: {
          borderWidth: 0,
        },
      },
    };
  }

  render() {
    console.log('rendering DepthChart');
    return ( this.props.visible &&
      <div className="chart secondary-bg-dark">
        <ConnectedGlyph connected={this.props.connected}/>
        { this.props.asks.length > 0 ?
          <div className="">
            <LineChart ref={(c) => { this.lineChart = c; }} refName="depthchart" config={this.config(this.props)} />
          </div>
          : <div>
            <Loader />
            <p className="centered">{`Chart will render when realtime data is received for
              ${this.props.productDisplayName ? this.props.productDisplayName : 'the selected product'}`}</p>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const content = 'Depth';
  const visible = state.view.topCenter.find(c => (c.id === content)).selected;

  const selectedWebsocket = state.websocket.products.find(p => {
    return p.active;
  });

  const asks = selectedWebsocket && selectedWebsocket.asks
    ? selectedWebsocket.asks.slice().reverse().reduce((data, ask) => {
      const volume = data.length > 0 ? parseFloat(ask.size) + data[data.length - 1][1] : parseFloat(ask.size);
      data.push([parseFloat(ask.price), volume])
      return data;
    }, [])
    : [];
  const bids = selectedWebsocket && selectedWebsocket.bids
    ? selectedWebsocket.bids.slice().reduce((data, bid) => {
      const volume = data.length > 0 ? parseFloat(bid.size) + data[data.length - 1][1] : parseFloat(bid.size);
      data.push([parseFloat(bid.price), volume])
      return data;
    }, []).reverse()
    : [];

  const connected = state.websocket.connected;

  return ({
    content,
    visible,
    asks,
    bids,
    connected
  })
};

const mapDispatchToProps = dispatch => (
  {
    // setZoomLevel: (level) => {
    //   dispatch(setZoomLevel(level));
    // },
  }
);

const DepthChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DepthChart);

export default DepthChartContainer;
