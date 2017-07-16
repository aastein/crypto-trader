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
    saveScript: (script) => {
      dispatch(saveScript(script));
    },
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
    editIndicator: (id, params) => {
      dispatch(editIndicator(id, params));
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
  }
);

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);

export default DashboardContainer;
