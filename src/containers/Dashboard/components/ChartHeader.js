import React, { Component } from 'react';
import ReactModal from 'react-modal';

import Dropdown from '../../../components/Dropdown';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import SliderDropdown from '../../../components/SliderDropdown';
import FetchButton from '../../../components/FetchButton';
import ObjectForm from '../../../components/ObjectForm';
import { INIT_GRANULARITY, INIT_RANGE } from '../../../utils/constants';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      granularity: `${INIT_GRANULARITY}`,
      showSlider: false,
      range: INIT_RANGE,
      editing: false,
    };
  }

  // only render if websocket status, internal state, product, or isFetching changed
  shouldComponentUpdate(nextProps, nextState) {
    const websocketStatusChanged = JSON.stringify(this.props.websocket.connected)
      !== JSON.stringify(nextProps.websocket.connected);
    const stateChanged = JSON.stringify(this.state)
       !== JSON.stringify(nextState);
    const fetchingChanged = this.props.chart.fetchingStatus !== nextProps.chart.fetchingStatus;
    const productChanged = this.selectedProduct(this.props).id !== this.selectedProduct(nextProps).id;
    const indicatorChaanged = this.props.chart.indicators !== nextProps.chart.indicators;
    return websocketStatusChanged || stateChanged || productChanged || fetchingChanged || indicatorChaanged;
  }

  onProductChange = (event) => {
    if (event) {
      const id = event.value;
      const granularity = this.product(id).granularity + '';
      const range = this.product(id).range;
      const nextProduct = this.product(id);
      if (nextProduct.data.length === 0) {
        this.props.fetchProductData(nextProduct.id, nextProduct.range, nextProduct.granularity);
      }
      this.props.selectProduct(id);
      this.setState(() => ({ granularity, range }));
      this.props.saveTestResult({});
    }
  }

  onSelectIndicator = (id) => {
    this.props.selectIndicator(id);
  }

  onClose = (id) => {
    this.setState(() => (
      { editing: false }
    ));
  }

  onSave = (indicator) => {
    this.setState(() => (
      { editing: false }
    ));
    this.props.editIndicator(indicator);
    this.props.calculateIndicators(this.selectedProduct(this.props).id);
  }

  onEditIndicator = (id) => {
    this.setState(() => (
      { editing: this.props.chart.indicators.reduce((a, b) => (b.id === id ? b : a), {}) }
    ));
  }

  onSelectDateRange = (event) => {
    if (event && event.value) {
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
    this.props.fetchProductData(product.id, this.state.range, this.state.granularity);
    this.props.saveTestResult({});
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

  handleGranularityChange = granularity => {
    this.setState(() => ({ granularity:  Math.pow(granularity, 2) + '' }));
  }

  render() {
    const selectedProduct = this.selectedProduct(this.props);
    const dropdownProductOptions = this.props.chart.products.map(product => (
      { value: product.id, label: product.display_name }
    )).filter(p => (
      this.props.selectedProductIds.indexOf(p.value) > -1
    ));

    const dropdownIndicatorOptions = this.props.chart.indicators.map(indicator => (
      { value: indicator.id, label: indicator.name, active: indicator.active }
    ));

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
            <Select
              className=""
              options={dropdownIndicatorOptions}
              value={'Indicators'}
              onCheck={this.onSelectIndicator}
              handleDrilldown={this.onEditIndicator}
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
                invalid={this.props.chart.fetchingStatus === 'failure'}
                maxLength={9}
                name="granularity"
                onChange={this.onSetGanularity}
                placeholder=""
                type="number"
                value={this.state.granularity}
              />
              <span className="granularity-label">s</span>
            </div>
            <SliderDropdown
              min={Math.ceil(Math.sqrt(this.state.range / 50))}
              max={Math.ceil(Math.sqrt(this.state.range * 5))}
              handleChange={this.handleGranularityChange}
              defaultValue={Math.sqrt(parseInt(this.state.granularity, 10))}
            />
            <FetchButton
              className="btn chart-header-item"
              onClick={this.onApply}
              isFetching={this.props.chart.fetchingStatus === 'fetching'}
              text="Apply"
            />
            <div className="websocket-status chart-header-item">
              <span className="realtime-data">Realtime data</span>
              <span
                className={`glyphicon glyphicon-dot chart-header-item
                  ${this.props.websocket.connected ? 'connected' : ''}`
                }
              />
            </div>
          </div>
        </div>
        <ReactModal
          contentLabel={'indicator name'}
          className={'react-modal'}
          overlayClassName={'react-modal-overlay'}
          isOpen={this.state.editing !== false}
          shouldCloseOnOverlayClick
        >
          <h3 className="title">{this.state.editing ? this.state.editing.name : ''}</h3>
          <ObjectForm
            hidden={['id', 'name', 'active', 'valueIds']}
            object={this.state.editing}
            onSave={this.onSave}
          />
          <button className="close" onClick={this.onClose}>Close</button>
        </ReactModal>
      </div>
    );
  }
}
