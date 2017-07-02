import { connect } from 'react-redux'

import { setProducts, setProduct, setDateRange, addScript, saveScript, deleteScript } from '../../actions'
import Dashboard from './components/Dashboard'

const mapStateToProps = state => {
  return {
    chart: state.chart,
    products: state.products,
    scripts: state.scripts
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
      dispatch(addScript)
    },
    onSave: script => {
      dispatch(saveScript(script))
    },
    onDelete: id => {
      dispatch(deleteScript(id))
    }
  }
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

export default DashboardContainer
