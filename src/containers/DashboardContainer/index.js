import { connect } from 'react-redux'

import { setProducts,
  setProduct,
  setProductData,
  setDateRange,
  addScript,
  saveScript,
  deleteScript,
  initDocs,
  selectScript,
  selectDoc
} from '../../actions'

import Dashboard from './components/Dashboard'

const mapStateToProps = state => {
  return {
    chart: state.chart,
    products: state.products,
    scripts: state.scripts,
    docs: state.docs
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProducts: products => {
      dispatch(setProducts(products))
    },
    onSelect: product => {
      dispatch(setProduct(product))
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
    setProductData: (id, data) => {
      dispatch(setProductData(id, data))
    },
    initDocs: () => {
      dispatch(initDocs())
    },
    onScriptClick: id => {
      dispatch(selectScript(id))
    },
    onDocClick: name => {
      dispatch(selectDoc(name))
    }
  }
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

export default DashboardContainer
