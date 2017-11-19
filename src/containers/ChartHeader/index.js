import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';

import {
  selectProduct,
  selectDateRange,
  setGranularity,
  selectIndicator,
  editIndicator,
  setProductWSData,
  setFetchingStatus,
  fetchProductData,
  calculateIndicators,
} from '../../actions';

import Dropdown from '../../components/Dropdown';
import Select from '../../components/Select';
import Input from '../../components/Input';
import SliderDropdown from '../../components/SliderDropdown';
import FetchButton from '../../components/FetchButton';
import ObjectForm from '../../components/ObjectForm';
import { INIT_GRANULARITY, INIT_RANGE } from '../../utils/constants';

class ChartHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      granularity: `${INIT_GRANULARITY}`,
      showSlider: false,
      range: INIT_RANGE,
      editing: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState);;
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
    this.props.calculateIndicators(this.props.productId);
  }

  // set editing to indicator object
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
    this.props.setGanularity(this.props.productId, this.state.granularity);
    this.props.selectDateRange(this.props.productId, this.state.range);
    this.props.fetchProductData(this.props.productId, this.state.range, this.state.granularity);
    this.props.saveTestResult({});
  }

  // get product by id
  product = id => (
    this.props.chart.products.length > 0 ? this.props.chart.products.reduce((a, p) => (
      p.id === id ? p : a
    ), {}) : {}
  )

  handleGranularityChange = granularity => {
    this.setState(() => ({ granularity:  Math.pow(granularity, 2) + '' }));
  }

  render() {
    console.log('rendering chart header container');
    return (
      <div className="chart-header">
        <div className="chart-header-item-container">
          <div className="chart-header-items">
            <Dropdown
              className="product-dropdown chart-header-item"
              options={this.props.dropdownProductOptions}
              onChange={this.onProductChange}
              value={this.props.productId}
            />
            <Select
              className=""
              options={this.props.dropdownIndicatorOptions}
              value={'Indicators'}
              onCheck={this.onSelectIndicator}
              handleDrilldown={this.onEditIndicator}
            />
            <Dropdown
              className="date-picker chart-header-item"
              options={this.props.dateRanges}
              onChange={this.onSelectDateRange}
              value={this.state.range}
            />
            <div className="granularity chart-header-item">
              <Input
                className="granularity"
                invalid={this.props.fetchingStatus === 'failure'}
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
              className = "chart-header-item"
              min={Math.ceil(Math.sqrt(this.state.range / 50))}
              max={Math.ceil(Math.sqrt(this.state.range * 5))}
              handleChange={this.handleGranularityChange}
              defaultValue={Math.sqrt(parseInt(this.state.granularity, 10))}
            />
            <FetchButton
              className="btn chart-header-item"
              onClick={this.onApply}
              isFetching={this.props.fetchingStatus === 'fetching'}
              text="Apply"
            />
            <div className="websocket-status chart-header-item">
              <span className="realtime-data">Realtime data</span>
              <span
                className={`glyphicon glyphicon-dot chart-header-item
                  ${this.props.connected ? 'connected' : ''}`
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


const mapStateToProps = state => {

  const selectedProduct = state.chart.products.find(p => {
    return p.active;
  });

  const productId = selectedProduct ? selectedProduct.id : '';


  const selectedProductIds = state.profile.selectedProducts.map(p => (p.value))

  // create data to populate product dropdown items
  const dropdownProductOptions = state.chart.products.map(product => (
    { value: product.id, label: product.display_name }
  )).filter(p => ( // filter out products not in the scope dictated by profile selections
    selectedProductIds.indexOf(p.value) > -1
  ));

  const dropdownIndicatorOptions = state.chart.indicators.map(indicator => (
    { value: indicator.id, label: indicator.name, active: indicator.active }
  ));

  const connected = state.websocket.connected;

  const fetchingStatus = state.chart.fetchingStatus;

  const dateRanges = state.chart.dateRanges;

  return ({
    productId,
    dropdownProductOptions,
    dropdownIndicatorOptions,
    connected,
    fetchingStatus,
    dateRanges,
  })
};

const mapDispatchToProps = dispatch => (
  {
    selectProduct: (id) => {
      dispatch(selectProduct(id));
    },
    setGranularity: (id, granularity) => {
      dispatch(setGranularity(id, granularity));
    },
    selectIndicator: (id) => {
      dispatch(selectIndicator(id));
    },
    editIndicator: (indicator) => {
      dispatch(editIndicator(indicator));
    },
    selectDateRange: (id, range) => {
      dispatch(selectDateRange(id, range));
    },
    setProductWSData: (id, data) => {
      dispatch(setProductWSData(id, data));
    },
    setFetchingStatus: (status) => {
      dispatch(setFetchingStatus(status));
    },
    fetchProductData: (id, range, granularity) => {
      dispatch(fetchProductData(id, range, granularity));
    },
    calculateIndicators: (id) => {
      dispatch(calculateIndicators(id));
    },
  }
);

const ChartHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartHeader);

export default ChartHeaderContainer;
