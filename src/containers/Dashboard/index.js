import { connect } from 'react-redux'

import { setProducts,
  selectProduct,
  setProductData,
  setProductWSData,
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
  clearLog
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
    setProducts: products => {
      dispatch(setProducts(products))
    },
    setProductData: (id, data) => {
      dispatch(setProductData(id, data))
    },
    setProductWSData: (id, ws_data) => {
        dispatch(setProductWSData(id, ws_data))
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
    }
  }
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

export default DashboardContainer
