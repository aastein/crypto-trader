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
  selectDoc,
  setGranularity,
  selectIndicator,
  editIndicator
} from '../../actions'

import Dashboard from './components/Dashboard'

const mapStateToProps = state => {
  return {
    chart: state.chart,
    products: state.products,
    scripts: state.scripts,
    docs: state.docs,
    indicators: state.indicators
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
    selectDoc: name => {
      dispatch(selectDoc(name))
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
    }
  }
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

export default DashboardContainer
