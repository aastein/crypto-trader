import React, { Component } from 'react';

import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/Input';
import { fetchProductData } from '../../../utils/api';
import { INIT_GRANULARITY, INIT_RANGE } from '../../../utils/constants';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      granularity: `${INIT_GRANULARITY}`,
      range: INIT_RANGE,
    };
  }

  // only render if websocket status or internal state changed
  shouldComponentUpdate(nextProps, nextState) {
    const websocketStatusChanged = JSON.stringify(this.props.websocket.connected)
      !== JSON.stringify(nextProps.websocket.connected);
    const stateChanged = JSON.stringify(this.state)
       !== JSON.stringify(nextState);
    const productChanged = this.selectedProduct(this.props).id !== this.selectedProduct(nextProps).id;
    return websocketStatusChanged || stateChanged || productChanged;
  }

  onProductChange = (event) => {
    if (event) {
      const id = event.value;
      const granularity = this.product(id).granularity + '';
      const range = this.product(id).range;
      const nextProduct = this.product(id);
      if (nextProduct.data.length === 0) {
        fetchProductData(nextProduct.id, nextProduct.range, nextProduct.granularity, this.props.setProductData,
          this.props.setFetchingStatus);
      }
      this.props.selectProduct(id);
      this.setState(() => ({ granularity, range }));
    }
  }

  onSelectIndicator = (event) => {
    if (event) {
      this.props.selectIndicator(event.value);
    }
  }

  onSelectDateRange = (event) => {
    if (event.value) {
      const range = event.value;
      this.setState(() => ({ range }));
    }
  }

  onSetGanularity = (name, event) => {
    if (event.target.validity.valid && event.target.value.length < 9) {
      const granularity = event.target.value;
      this.setState(() => ({ granularity }));
    }
  }

  onApply = () => {
    const product = this.props.chart.products.reduce((a, p) => (
      p.active ? p : a
    ), {});
    this.props.setGanularity(product.id, this.state.granularity);
    this.props.selectDateRange(product.id, this.state.range);
    fetchProductData(product.id, this.state.range, this.state.granularity, this.props.setProductData,
      this.props.setFetchingStatus);
  }

  selectedProduct = props => (
    props.chart.products.length > 0 ? props.chart.products.reduce((a, p) => (
      p.active ? p : a
    ), {}) : {}
  )

  product = id => (
    this.props.chart.products.length > 0 ? this.props.chart.products.reduce((a, p) => (
      p.id === id ? p : a
    ), {}) : {}
  )

  render() {
    const selectedProduct = this.selectedProduct(this.props);
    const dropdownProductOptions = this.props.chart.products.map(product => (
      { value: product.id, label: product.display_name }
    )).filter(p => (
      this.props.selectedProductIds.indexOf(p.value) > -1
    ));

    const dropdownIndicatorOptions = this.props.chart.indicators.map(indicator => (
      { value: indicator.id, label: indicator.id }
    ));

    const activeIndicator = this.props.chart.indicators.reduce((a, b) => (
      b.active ? b : a
    ), {});

    return (
      <div className="chart-header">
        <div className="chart-header-item-container">
          <div className="chart-header-items">
            <Dropdown
              className="product-dropdown chart-header-item"
              options={dropdownProductOptions}
              onChange={this.onProductChange}
              value={selectedProduct.id}
            />
            <Dropdown
              className="indicator-dropdown chart-header-item"
              options={dropdownIndicatorOptions}
              onChange={this.onSelectIndicator}
              value={activeIndicator.id}
            />
            <Dropdown
              className="date-picker chart-header-item"
              options={this.props.chart.dateRanges}
              onChange={this.onSelectDateRange}
              value={this.state.range}
            />
            <div className="granularity chart-header-item">
              <Input
                className="granularity"
                maxLength={9}
                name="granularity"
                onChange={this.onSetGanularity}
                placeholder=""
                type="number"
                value={this.state.granularity}
              />
              <span className="granularity-label">s</span>
            </div>
            <button className="btn chart-header-item" onClick={this.onApply} disabled={this.props.chart.isFetching}>Apply</button>
            <div className="websocket-status chart-header-item">
              <span>Realtime data</span>
              <span
                className={`glyphicon glyphicon-dot chart-header-item
                  ${this.props.websocket.connected ? 'connected' : ''}`
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
