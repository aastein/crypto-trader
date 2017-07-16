import React, { Component } from 'react';

import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/Input';
import { fetchProductData } from '../../../utils/api';
import { INIT_GRANULARITY } from '../../../utils/constants';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      granularity: this.selectedProduct().granularity ?
        `${this.selectedProduct().granularity}` : `${INIT_GRANULARITY}`,
    };
  }

  onProductChange = (event) => {
    if (event) {
      const id = event.value;
      const granularity = this.product(id).granularity + '';
      this.props.selectProduct(event.value);
      this.setState(() => ({ granularity }));
    }
  }

  onSelectIndicator = (event) => {
    if (event) {
      this.props.selectIndicator(event.value);
    }
  }

  onSelectDateRange = (event) => {
    const id = this.props.chart.products.reduce((a, p) => (
      p.active ? p.id : a
    ), '');
    if (event) {
      this.props.selectDateRange(id, event.value);
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
    fetchProductData(product.id, product.range, this.state.granularity, this.props.setProductData,
      this.props.setFetchingStatus);
  }

  selectedProduct = () => (
    this.props.chart.products.length > 0 ? this.props.chart.products.reduce((a, p) => (
      p.active ? p : a
    ), {}) : {}
  )

  product = id => (
    this.props.chart.products.length > 0 ? this.props.chart.products.reduce((a, p) => (
      p.id === id ? p : a
    ), {}) : {}
  )

  render() {
    const selectedProduct = this.selectedProduct();
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
              value={selectedProduct.range}
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