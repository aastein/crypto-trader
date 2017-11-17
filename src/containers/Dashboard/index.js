import { connect } from 'react-redux';

import {
  selectProduct,
  setProductData,
  selectDateRange,
  addScript,
  saveScript,
  deleteScript,
  selectScript,
  selectProductDoc,
  setGranularity,
  selectIndicator,
  editIndicator,
  appendLog,
  clearLog,
  updateAccounts,
  toggleScriptLive,
  saveTestResult,
  setProductWSData,
  addProductData,
  setFetchingStatus,
  addOrder,
  fetchAccounts,
  fetchProductData,
  setLocation,
  calculateIndicators,
} from '../../actions';

import Dashboard from './components/Dashboard';

const mapStateToProps = state => (
  {
    chart: state.chart,
    scripts: state.scripts,
    profile: state.profile,
    log: state.log,
    websocket: state.websocket,
  }
);

const mapDispatchToProps = dispatch => (
  {
    setProductData: (id, data) => {
      dispatch(setProductData(id, data));
    },
    selectProduct: (id) => {
      dispatch(selectProduct(id));
    },
    addScript: () => {
      dispatch(addScript());
    },
    saveScript: (script) => (
      dispatch(saveScript(script))
    ),
    deleteScript: (id) => {
      dispatch(deleteScript(id));
    },
    selectScript: (id) => {
      dispatch(selectScript(id));
    },
    selectProductDoc: (name) => {
      dispatch(selectProductDoc(name));
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
    appendLog: (log) => {
      dispatch(appendLog(log));
    },
    clearLog: () => {
      dispatch(clearLog());
    },
    updateAccounts: (accounts) => {
      dispatch(updateAccounts(accounts));
    },
    toggleScriptLive: (id) => {
      dispatch(toggleScriptLive(id));
    },
    saveTestResult: (result) => {
      dispatch(saveTestResult(result));
    },
    setProductWSData: (id, data) => {
      dispatch(setProductWSData(id, data));
    },
    addProductData: (id, data) => {
      dispatch(addProductData(id, data));
    },
    setFetchingStatus: (status) => {
      dispatch(setFetchingStatus(status));
    },
    addOrder: (id, productId, time, price) => {
      dispatch(addOrder(id, productId, time, price));
    },
    fetchAccounts: (session) => {
      dispatch(fetchAccounts(session));
    },
    fetchProductData: (id, range, granularity) => {
      dispatch(fetchProductData(id, range, granularity));
    },
    setLocation: (location) => {
      dispatch(setLocation(location));
    },
    calculateIndicators: (id) => {
      dispatch(calculateIndicators(id));
    },
  }
);

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);

export default DashboardContainer;
