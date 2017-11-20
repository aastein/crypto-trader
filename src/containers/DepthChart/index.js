import React, { Component } from 'react';
import { connect } from 'react-redux';

import LineChart from '../../components/LineChart';
import Loader from '../../components/Loader';

class DepthChart extends Component {
  // bundle websocket data into OHLC and append to historical data given time conditions
  componentWillReceiveProps = (nextProps) => {
    // console.log('will receive props');
  }

  // return false, do update with child chart API via ref
  shouldComponentUpdate(nextProps) {
    if(this.lineChart && this.lineChart.depthchart) {
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
          }
        }
      }
    }
    return this.props.asks.length === 0 && nextProps.asks.length > 0;
  }

  dataChanged = (nextConfig) => {
    return JSON.stringify(this.config(this.props).series[0].data) !== JSON.stringify(nextConfig.series[0].data)
      || JSON.stringify(this.config(this.props).series[1].data) !== JSON.stringify(nextConfig.series[1].data);
  }

  config = (props) => {
    return {
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
      },
      xAxis: [{
        min: Math.floor(100*props.bids[0][0])/100,
        max: Math.ceil(100*props.asks[props.asks.length - 1][0])/100,
        allowDecimals: false,
        labels: {
          y: 13,
        },
        reversed: false,
        tickLength: 3,
        type: 'linear',
      }],
      yAxis: [{
        min: 0,
        max: 500,
        allowDecimals: false,
        labels: {
          align: 'left',
          x: 5,
        },
        lineWidth: 1,
      }],
      series: [{
        data: props.bids,
        animation: false,
        tooltip: {
          valueDecimals: 2,
        },
        color: 'hsla(101, 84%, 71%, 0.6)',
      },
      {
        data: props.asks,
        animation: false,
        tooltip: {
          valueDecimals: 2,
        },
        color: 'hsla(15, 83%, 61%, 0.6)',
      },
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
    console.log('rendering WebsocketChart');
    return (
      <div className="websocket-chart">
        { this.props.asks.length > 0 ?
          <div>
            <LineChart ref={(c) => { this.lineChart = c; }} refName="depthchart" config={this.config(this.props)} />
          </div>
          : <div>
            <Loader />
            <p className="loading-message">{`Chart will render when realtime data is received for
              ${this.props.productDisplayName ? this.props.productDisplayName : 'the selected product'}`}</p>
          </div>
        }
      </div>
    );
  }
}

let asd = 0;

const mapStateToProps = state => {
  const content = 'Depth Chart';
  const contentOptions = state.view.topRight.map(c => (c.id));
  const visible = state.view.topCenter.find(c => (c.id === content)).selected;

  const selectedWebsocket = state.websocket.products.find(p => {
    return p.active;
  });

  let asks = selectedWebsocket && selectedWebsocket.asks
    ? selectedWebsocket.asks.slice().reverse().reduce((data, ask) => {
      const volume = data.length > 0 ? parseFloat(ask.size) + data[data.length - 1][1] : parseFloat(ask.size);
      data.push([parseFloat(ask.price), volume])
      return data;
    }, [])
    : [];
  let bids = selectedWebsocket && selectedWebsocket.bids
    ? selectedWebsocket.bids.slice().reduce((data, bid) => {
      const volume = data.length > 0 ? parseFloat(bid.size) + data[data.length - 1][1] : parseFloat(bid.size);
      data.push([parseFloat(bid.price), volume])
      return data;
    }, []).reverse()
    : [];

  if (asd < 9) {
    // console.log('bids', bids);
    asd += 1;
  } else {
    // asks = [];
  }

  // bids = [];

  return ({
    contentOptions,
    content,
    visible,
    asks,
    bids,
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
