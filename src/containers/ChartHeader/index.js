import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  calculateIndicators,
  fetchProductData,
  initWebsocket,
  fetchOrders,
  fetchFills
} from '../../actions/thunks';

import {
  selectProduct,
  setGranularity,
  selectIndicator,
  editIndicator,
  setDateRange,
  setFetchingStatus,
  saveTestResult,
} from '../../actions';

import * as selectors from '../../selectors';

import Dropdown from '../../components/Dropdown';
import Select from '../../components/Select';
import Input from '../../components/Input';
import SliderDropdown from '../../components/SliderDropdown';
import FetchButton from '../../components/FetchButton';
import ObjectForm from '../../components/ObjectForm';
import { INIT_GRANULARITY, INIT_RANGE } from '../../constants/product';

class ChartHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      granularity: `${INIT_GRANULARITY}`,
      showSlider: false,
      range: INIT_RANGE,
      editing: false,
      dateRanges: [
        { label: '1 minute', value: 1 },
        { label: '5 minutes', value: 5 },
        { label: '10 minute', value: 10 },
        { label: '30 minutes', value: 30 },
        { label: '1 hour', value: 60 },
        { label: '3 hours', value: 180 },
        { label: '6 hours', value: 360 },
        { label: '1 day', value: 1440 },
        { label: '5 days', value: 7200 },
        { label: '10 days', value: 14400 },
        { label: '1 Month', value: 43200 },
        { label: '3 Months', value: 129600 },
        { label: '6 Months', value: 259200 },
        { label: '1 Year', value: 518400 },
      ],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState);
  }

  // re-init websocket, fetch product specific data, change active flags in product arrays
  // todo: remve active flag from products and wensocket, only maintain this in profie.
  onProductChange = (event) => {
    if (event) {
      const id = event.value;
      // fetch historical data
      this.props.fetchProductData(this.props.exchangeId, id, this.state.range, this.state.granularity);
      // init websocket for product
      this.props.initWebsocket(this.props.exchangeId, id, this.props.dropdownProductOptions.map(p => (p.value)));
      // fetch orders
      this.props.fetchOrders(this.props.exchangeId, id);
      // fetch fills
      this.props.fetchFills(this.props.exchangeId, id);
      // set product
      this.props.selectProduct(this.props.exchangeId, id);
      // clear test result
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

  onSave = (e, indicator) => {
    e.preventDefault();
    this.setState(() => (
      { editing: false }
    ));
    this.props.editIndicator(indicator);
    this.props.calculateIndicators(this.props.exchangeId, this.props.productId);
  }

  // set editing to indicator object
  onEditIndicator = (id) => {
    this.setState(() => (
      { editing: this.props.indicators.reduce((a, b) => (b.id === id ? b : a), {}) }
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
    this.props.setGranularity(this.props.exchangeId, this.props.productId, this.state.granularity);
    this.props.setDateRange(this.props.exchangeId, this.props.productId, this.state.range);
    this.props.fetchProductData(this.props.exchangeId, this.props.productId, this.state.range, this.state.granularity);
    this.props.saveTestResult({});
  }

  handleGranularityChange = granularity => {
    this.setState(() => ({ granularity:  Math.pow(granularity, 2) + '' }));
  }

  render() {
    // console.log('rendering chart header container', this.props);
    return (
      <div className="p-1 bg-dark">
        <div className="container">
          <div className="columns">
            <Dropdown
              className="col-2 col-lg-4"
              options={this.props.dropdownProductOptions}
              onChange={this.onProductChange}
              value={this.props.productId}
            />
            <Select
              className="col-3 col-lg-4"
              options={this.props.dropdownIndicatorOptions}
              value={'Indicators'}
              onCheck={this.onSelectIndicator}
              handleDrilldown={this.onEditIndicator}
            />
            <Dropdown
              className="col-2 col-lg-4"
              options={this.state.dateRanges}
              onChange={this.onSelectDateRange}
              value={this.state.range}
            />
            <div className="granularity columns col-3 col-lg-6">
              <Input
                className="col-9"
                invalid={this.props.fetchingStatus === 'failure'}
                maxLength={9}
                name="granularity"
                onChange={this.onSetGanularity}
                placeholder=""
                type="text"
                value={this.state.granularity}
              />
              <div className="relative"><label className="absolute">s</label></div>
              <SliderDropdown
                className = "col-2"
                min={Math.ceil(Math.sqrt(this.state.range / 50))}
                max={Math.ceil(Math.sqrt(this.state.range * 5))}
                handleChange={this.handleGranularityChange}
                defaultValue={Math.sqrt(parseInt(this.state.granularity, 10))}
              />
            </div>
            <FetchButton
              className="btn btn-primary btn-fetch col-2 col-lg-4"
              onClick={this.onApply}
              isFetching={this.props.fetchingStatus === 'fetching'}
              text="Apply"
            />
          </div>
        </div>
        { this.state.editing !== false && <div className='modal active'>
          <div className="modal-overlay"></div>
          <div className="modal-container">
            <div className="modal-body">
              <div className="content">
                <div className="h3 text-dark">{this.state.editing ? this.state.editing.name : ''}</div>
                <ObjectForm
                  hidden={['id', 'name', 'active', 'valueIds']}
                  object={this.state.editing}
                  onSave={this.onSave}
                  closeButton={(<button className="btn col-3" onClick={this.onClose}>Close</button>)}
                />
              </div>
            </div>
          </div>
        </div> }
      </div>
    );
  }
}


const mapStateToProps = state => {
  const selectedExchange = selectors.selectedExchange(state);
  const exchangeId = selectedExchange.id;
  const selectedProduct = selectors.selectedProduct(selectedExchange);
  const productId = selectors.productId(selectedProduct);
  const fetchingStatus = selectedExchange.fetching;
  const indicators = state.indicators;
  // create data to populate product dropdown items
  const dropdownProductOptions = selectedExchange.products ? selectedExchange.products.map(product => (
    { value: product.id, label: product.display_name, active: product.active }
  )) : [];
  const dropdownIndicatorOptions = state.indicators.map(indicator => (
    { value: indicator.id, label: indicator.name, active: indicator.active }
  ));
  return ({
    productId,
    dropdownProductOptions,
    dropdownIndicatorOptions,
    fetchingStatus,
    indicators,
    exchangeId,
  })
};

const mapDispatchToProps = dispatch => (
  {
    selectProduct: (exchnage, id) => {
      dispatch(selectProduct(exchnage, id));
    },
    setGranularity: (exchnage, id, granularity) => {
      dispatch(setGranularity(exchnage, id, granularity));
    },
    selectIndicator: (exchnage, id) => {
      dispatch(selectIndicator(exchnage, id));
    },
    editIndicator: (indicator) => {
      dispatch(editIndicator(indicator));
    },
    setDateRange: (exchnage, id, range) => {
      dispatch(setDateRange(exchnage, id, range));
    },
    setFetchingStatus: (exchnage, status) => {
      dispatch(setFetchingStatus(exchnage, status));
    },
    fetchProductData: (exchange, id, range, granularity) => {
      dispatch(fetchProductData(exchange, id, range, granularity));
    },
    calculateIndicators: (exchnage, id) => {
      dispatch(calculateIndicators(exchnage, id));
    },
    saveTestResult: result => {
      dispatch(saveTestResult(result));
    },
    initWebsocket: (exchnage, activeId, ids) => {
      dispatch(initWebsocket(exchnage, activeId, ids));
    },
    fetchOrders: (exchnage, id) => {
      dispatch(fetchOrders(exchnage, id));
    },
    fetchFills: (exchnage, id) => {
      dispatch(fetchFills(exchnage, id));
    },
  }
);

const ChartHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartHeader);

export default ChartHeaderContainer;
