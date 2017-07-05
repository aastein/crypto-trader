import { connect } from 'react-redux'

import { setProducts,
  setProduct,
  setProductData,
  setProductWSData,
  setDateRange,
  addScript,
  saveScript,
  deleteScript,
  initDocs,
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
    onSelect: productId => {
      dispatch(setProduct(productId))
    },
    onApply: (startDate, endDate) => {
      dispatch(setDateRange(startDate, endDate))
    },
    onAdd: () => {
      dispatch(addScript())
    },
    onSave: script => {
      dispatch(saveScript(script))
    },
    onDelete: id => {
      dispatch(deleteScript(id))
    },
    initDocs: () => {
      dispatch(initDocs())
    },
    onScriptClick: id => {
      dispatch(selectScript(id))
    },
    onDocClick: name => {
      dispatch(selectDoc(name))
    },
    onSetGanularity: (id, granularity) => {
      dispatch(setGranularity(id, granularity))
    },
    onSelectIndicator: (id) => {
      dispatch(selectIndicator(id))
    },
    onEditIndicator: (id, params) => {
      dispatch(editIndicator(id, params))
    }
  }
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

export default DashboardContainer
