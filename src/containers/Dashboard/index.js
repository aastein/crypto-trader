import { connect } from 'react-redux'

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
  updateAccounts
} from '../../actions'

import Dashboard from './components/Dashboard'

const mapStateToProps = state => {
  return {
    chart: state.chart,
    scripts: state.scripts,
    profile: state.profile,
    log: state.log
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProductData: (id, data) => {
      dispatch(setProductData(id, data))
    },
    selectProduct: id => {
      dispatch(selectProduct(id))
    },
    addScript: () => {
      dispatch(addScript())
    },
    saveScript: script => {
      dispatch(saveScript(script))
    },
    deleteScript: id => {
      dispatch(deleteScript(id))
    },
    selectScript: id => {
      dispatch(selectScript(id))
    },
    selectProductDoc: name => {
      dispatch(selectProductDoc(name))
    },
    setGranularity: (id, granularity) => {
      dispatch(setGranularity(id, granularity))
    },
    selectIndicator: (id) => {
      dispatch(selectIndicator(id))
    },
    editIndicator: (id, params) => {
      dispatch(editIndicator(id, params))
    },
    selectDateRange: (id, range) => {
      dispatch(selectDateRange(id, range))
    },
    appendLog: (log) => {
      dispatch(appendLog(log))
    },
    clearLog: () => {
      dispatch(clearLog())
    },
    updateAccounts: accounts => {
      dispatch(updateAccounts(accounts))
    }
  }
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

export default DashboardContainer
