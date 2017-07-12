import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LineChart from '../../../components/LineChart';
import { Loader } from '../../../components/Loader';

export default class Websocket extends Component {

  componentWillReceiveProps = (nextProps) => {

          products: state.products.map((p) => {
            const product = p;
            if (product.id === action.id) {
              // get procut historical data
              let data = product.data ? [...product.data] : [];
              // get time of newest product historical data
              const newestdatatime = data[data.length - 1] && data[data.length - 1].time ?
                data[data.length - 1].time : null;
              // get all web socket data for product
              let wsData = product.wsData ? [...product.wsData, ...action.wsData] : action.wsData;
              // if web socket data is not array, set it to empty array
              wsData = wsData && wsData.length ? wsData : [];
              // get time of oldest and newest web socket data
              const newestwsdatatime = wsData[wsData.length - 1].time ?
                wsData[wsData.length - 1].time : null;
              const oldestwsdatatime = wsData[0].time ?
                wsData[0].time : null;
              // sort by time, newest data on top
              wsData = wsData.sort((a, b) => {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return 0;
              }).filter((d) => {
                if (oldestwsdatatime) {
                  // filter out data older than granularity time
                  return (newestwsdatatime - d.time < product.granularity * 1000);
                }
                return true;
              });
              // if multiple transactions per ms, avaerage the transactions
              let cleanWSData = [];
              if (wsData.length > 1) {
                for (let i = 0; i < wsData.length; i += 1) {
                  const d = wsData[i];
                  if (wsData[i + 1] && wsData[i].time === wsData[i + 1].time) {
                    d.price = (d.price + wsData[i + 1].price) / 2;
                    d.size = (d.size + wsData[i + 1].size) / 2;
                    i += 1;
                  }
                  cleanWSData.push(d);
                }
              } else {
                cleanWSData = [...wsData];
              }
              if (oldestwsdatatime && newestdatatime &&
                  (newestwsdatatime - newestdatatime >= product.granularity * 1000)) {
                // console.log('compiling ws data to data')
                let newdata = [...cleanWSData];
                newdata = newdata.reduce((ohlc, d) => (
                  {
                    ...ohlc,
                    high: d.price > ohlc.high ? d.price : ohlc.high,
                    low: d.price < ohlc.low ? d.price : ohlc.low,
                    volume: d.size + ohlc.volume,
                  }
                ), {
                  open: cleanWSData[0].price,
                  high: Number.MIN_SAFE_INTEGER,
                  low: Number.MAX_SAFE_INTEGER,
                  close: cleanWSData[cleanWSData.length - 1].price,
                  time: newestwsdatatime,
                  volume: 0,
                });
                data = [...data, newdata];
                const inds = indicators(state.indicators, data);
                return { ...product,
                  data,
                  wsData: cleanWSData,
                  srsi: inds.srsi,
                  rsi: inds.rsi,
                  cci: inds.cci,
                  metasrsi: inds.metasrsi,
                };
              }
              // return product with new ws_data and new data
              return { ...product, data, wsData: cleanWSData };
            }
            // return product because we are not updating the prduct with this ID
            return product;
          }),
        };

        if(){
          setProductData(data)
        }
  }

  shouldComponentUpdate = (nextProps) => (
    this.websocketDataChanged(nextProps.websocket.products, selectedProduct(nextProps.products).id)
  )

  websocketDataChanged = (nextProducts, nextId) => {
    let productData = selectedProduct(this.props.websocket.products).data;
    for (let i = 0; i < nextProducts.length; i +=1) {
      if (id === nextProducts[i].id) {
        return JSON.stringify(productData)
        !== JSON.stringify(nextProducts[i].data)
          || productData.length !== nextProducts[i].data.length
      }
    }
    return false;
  }

  selectedProduct = (products) => (
    props.products.length > 0 ?
      props.products.reduce((a, p) => (p.active ? p : a), {})
      : { id: '', data: [] }
  )

  render() {

    const selectedProduct = selectedProduct(this.props.websocket.products)

    const selectedProductWSPriceData = selectedProduct.data ?
      selectedProduct.data.map(d => ([d.time, d.price])) : [];

    const selectedProductWSVolumeData = selectedProduct.data ?
      selectedProduct.data.map(d => ([d.time, d.size])) : [];

    const wsConfig = {
      yAxis: [{
        labels: {
          align: 'right',
          x: -3,
        },
        height: '114%',
        top: '-14%',
        lineWidth: 2,
      },
      {
        labels: {
          align: 'right',
          x: -3,
        },
        top: '85%',
        height: '15%',
        offset: 0,
        lineWidth: 2,
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
      <div>
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
};

Websocket.propTypes = {
  websocket: PropTypes.object.isRequired,
};
