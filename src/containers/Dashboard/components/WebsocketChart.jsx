import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LineChart from '../../../components/LineChart';
import Loader from '../../../components/Loader';
import run from '../../../utils/scriptEnv';

export default class WebsocketChart extends Component {

  componentWillReceiveProps = (nextProps) => {
    // console.log('will receive props');
    if (this.websocketDataChanged(this.props.websocket.products, nextProps.websocket.products)) {
      const product = this.selectedProduct(nextProps.products);
      // get procut historical data
      const data = product.data ? [...product.data] : [];
      // get time of newest product historical data
      const newestdatatime = data[data.length - 1] && data[data.length - 1].time ?
        data[data.length - 1].time : null;

      // get all web socket data for product
      let wsData = this.productById(nextProps.websocket.products, product.id).data;

      if (wsData.length > 0) {
        // get time of oldest and newest web socket data
        const newestwsdatatime = wsData[wsData.length - 1].time;
        // add compiled ws data to historical data
        if (newestwsdatatime - newestdatatime >= product.granularity * 1000) {
          // console.log('ws data order than granularity');
          // filter out data older than granularity time
          wsData = wsData.filter(d => (
            (newestwsdatatime - d.time < product.granularity * 1000)
          ));
          this.props.setProductWSData(product.id, wsData);

          // comile ws data to OHLC data
          const wsOHLC = wsData.reduce((ohlc, d) => (
            {
              ...ohlc,
              high: d.price > ohlc.high ? d.price : ohlc.high,
              low: d.price < ohlc.low ? d.price : ohlc.low,
              volume: d.size + ohlc.volume,
            }
          ), {
            open: wsData[0].price,
            high: Number.MIN_SAFE_INTEGER,
            low: Number.MAX_SAFE_INTEGER,
            close: wsData[wsData.length - 1].price,
            time: newestwsdatatime,
            volume: 0,
          });
          this.props.addProductData(product.id, wsOHLC);
        }
      }

      for (let i = 0; i < nextProps.scripts.length; i += 1) {
        if (nextProps.scripts[i].live && nextProps.profile.live) {
          run(
            nextProps.scripts[i].script,
            nextProps.products,
            nextProps.profile,
            nextProps.appendLog,
            nextProps.updateAccounts,
          );
        }
      }
    }
  }

  shouldComponentUpdate = (nextProps) => {
    const a = this.websocketDataChanged(this.props.websocket.products, nextProps.websocket.products);
    return a;
  }

  websocketDataChanged = (now, next) => {
    const nowProds = [...now];
    const nextPords = [...next];
    const selectedProduct = nowProds.reduce((a, p) => (p.active ? p : a), { id: '', data: [] });
    const nextSelectedProduct = nextPords.reduce((a, p) => (p.active ? p : a), { id: '', data: [] });
    return (nextSelectedProduct.id !== selectedProduct.id) ||
      (nextSelectedProduct.data.length !== selectedProduct.data.length) ||
      JSON.stringify(nextSelectedProduct.data) !== JSON.stringify(selectedProduct.data);
  }

  productById = (products, id) => (
    products.reduce((a, b) => (
      b.id === id ? b : a
    ), {})
  )

  selectedProduct = products => (
    products.length > 0 ?
      products.reduce((a, p) => (p.active ? p : a), { id: '', data: [] }) : { id: '', data: [] }
  )

  render() {
    // console.log(this.props);
    const selectedProduct = this.selectedProduct(this.props.websocket.products);

    const selectedProductWSPriceData = selectedProduct.data ?
      selectedProduct.data.map(d => ([d.time, d.price])) : [];

    const selectedProductWSVolumeData = selectedProduct.data ?
      selectedProduct.data.map(d => ([d.time, d.size])) : [];

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
        data: selectedProductWSPriceData,
        type: 'line',
        name: 'Price',
        tooltip: {
          valueDecimals: 2,
        },
      },
      {
        type: 'column',
        name: 'Size',
        data: selectedProductWSVolumeData,
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
        { selectedProduct.data && selectedProduct.data.length > 0 ?
          <div>
            <LineChart config={wsConfig} />
          </div>
          : <div>
            <Loader />
          </div>
        }
      </div>
    );
  }
}
