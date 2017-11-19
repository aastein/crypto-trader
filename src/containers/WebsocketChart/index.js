import { connect } from 'react-redux';
import React, { Component } from 'react';

import {
  setProductData,
  setProductWSData,
  addProductData,
} from '../../actions';

import LineChart from '../../components/LineChart';
import Loader from '../../components/Loader';
import run from '../../utils/scriptEnv';

class WebsocketChart extends Component {

  // bundle websocket data into OHLC and append to historical data given time conditions
  componentWillReceiveProps = (nextProps) => {
    // console.log('will receive props');
    if (this.dataChanged(this.props, nextProps)) {
      this.runLiveScripts(nextProps);
      if (nextProps.priceData.length > 0 && nextProps.volumeData.length > 0) {
        // add compiled ws data to historical data
        // this works because latestWSDtime becomes latestHistDtime
        if (nextProps.latestWebsocketDataTime - nextProps.latestHistoricalDataTime >= nextProps.granularity * 1000) {
          // filter out data older than granularity time
          const websocketData = nextProps.priceData.map((d, i) => {
            return { ...d, ...nextProps.volumeData[i] }
          }).filter((d, i)=> {
            //return nextProps.latestWebsocketDataTime - d.time < nextProps.granularity * 1000;
            return d.time > nextProps.latestHistoricalDataTime;
          });
          // pruning old websocket data in state
          this.props.setProductWSData(nextProps.productId, websocketData);

          // comile ws data to OHLC data
          const wsOHLC = websocketData.reduce((ohlc, d) => (
            {
              ...ohlc,
              high: d.price > ohlc.high ? d.price : ohlc.high,
              low: d.price < ohlc.low ? d.price : ohlc.low,
              volume: d.size + ohlc.volume,
            }
          ), {
            open: websocketData[0].price,
            high: Number.MIN_SAFE_INTEGER,
            low: Number.MAX_SAFE_INTEGER,
            close: websocketData[websocketData.length - 1].price,
            time: nextProps.latestWebsocketDataTime,
            volume: 0,
          });
          // add new slice of historical data
          this.props.addProductData(nextProps.productId, wsOHLC);
        }
      }
    }
  }

  runLiveScripts = nextProps => {
    if (nextProps.live)  {
      for (let i = 0; i < nextProps.liveScripts; i += 1) {
        run(
          nextProps.scripts[0].script, // include header script
          nextProps.scripts[i].script, // run script at index
           // include nessesary data
          nextProps.products,
          nextProps.profile,
          // include nessesary actions
          nextProps.appendLog,
          nextProps.updateAccounts,
          nextProps.addOrder,
        );
      }
    }
  }

  // shouldComponentUpdate = (nextProps) => {
  //   const a = this.websocketDataChanged(this.props.websocket.products, nextProps.websocket.products);
  //   return a;
  // }

  dataChanged = (now, next) => {
    const productChanged = next.id !== now.id;
    const priceDataChanged = JSON.stringify(next.priceData) !== JSON.stringify(next.priceData);
    const volumeDataChanged = JSON.stringify(next.volumeData) !== JSON.stringify(next.volumeData);
    return productChanged || priceDataChanged || volumeDataChanged;
  }

  render() {
    const wsConfig = {
      rangeSelector: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      chart: {
        marginBottom: 51,
      },
      xAxis: [{
        labels: {
          y: 13,
          staggerLines: 2,
        },
        tickLength: 3,
      }],
      yAxis: [{
        labels: {
          align: 'left',
          x: 5,
        },
        lineWidth: 1,
      },
      {
        labels: {
          enabled: false,
        },
        top: '85%',
        height: '15%',
        offset: 0,
        lineWidth: 1,
      }],
      series: [{
        data: this.props.priceData,
        type: 'line',
        name: this.props.productId,
        tooltip: {
          valueDecimals: 2,
        },
      },
      {
        type: 'column',
        name: 'Volume',
        data: this.props.volumeData,
        yAxis: 1,
      }],
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

    return (
      <div className="websocket-chart">
        { this.props.websocketPriceData.length > 0 ?
          <div>
            <LineChart config={wsConfig} />
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


const mapStateToProps = state => {

  const selectedProduct = state.chart.products.find(p => {
    return p.active;
  });

  const selectedWebsocket = state.websocket.products.find(p => {
    return p.active;
  });

  const productId = selectedProduct ? selectedProduct.id : '';
  const productDisplayName = selectedProduct ? selectedProduct.display_name : '';
  const websocketPriceData =  selectedWebsocket && selectedWebsocket.data ?
      selectedWebsocket.data.map(d => ([d.time, d.price])) : [];
  const websocketVolumeData = selectedWebsocket && selectedWebsocket.data ?
      selectedWebsocket.data.map(d => ([d.time, d.size])) : [];
  const latestWebsocketDataTime = websocketPriceData.length > 0 && websocketPriceData[websocketPriceData.length - 1].time
    ? websocketPriceData[websocketPriceData.length - 1].time
    : null;
  const historicalData = selectedProduct ? selectedProduct.data : [];
  const latestHistoricalDataTime = historicalData[historicalData.length - 1] && historicalData[historicalData.length - 1].time
    ? historicalData[historicalData.length - 1].time
    : null;
  const live = state.profile.live;
  const liveScripts = state.scripts.filter(s => {
    return s.live;
  });
  const granularity = selectedProduct ? selectedProduct.granularity : null ;
  const connected = state.websocket.connected;
  const scripts = state.scripts;
  const profile = state.profile;

  return ({
    scripts,
    profile,
    productId,
    productDisplayName,
    websocketPriceData,
    websocketVolumeData,
    historicalData,
    latestHistoricalDataTime,
    live,
    liveScripts,
    latestWebsocketDataTime,
    granularity,
    connected,
  })
};

const mapDispatchToProps = dispatch => (
  {
    setProductData: (id, data) => {
      dispatch(setProductData(id, data));
    },
    setProductWSData: (id, data) => {
      dispatch(setProductWSData(id, data));
    },
    addProductData: (id, data) => {
      dispatch(addProductData(id, data));
    },
  }
);

const WebsocketChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WebsocketChart);

export default WebsocketChartContainer;
