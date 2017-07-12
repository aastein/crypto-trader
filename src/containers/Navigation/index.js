import { connect } from 'react-redux';
import {
  updateAccounts,
  updateOrderBook,
  setProducts,
  setProductData,
  selectProduct,
  setProductWSData,
  updateHeartbeat,
} from '../../actions';
import Navbar from './components/Navbar';

const mapStateToProps = state => (
  {
    live: state.profile.live,
    accounts: state.profile.accounts,
    session: state.profile.session,
    products: state.chart.products,
    websocket: state.websocket,
    selectedProductIds: state.profile.selectedProducts.map(p => (p.value)),
  }
);

const mapDispatchToProps = dispatch => (
  {
    updateAccounts: (accounts) => {
      dispatch(updateAccounts(accounts));
    },
    updateOrderBook: (id, orderBook) => {
      dispatch(updateOrderBook(id, orderBook));
    },
    setProducts: (products) => {
      dispatch(setProducts(products));
    },
    setProductData: (id, data) => {
      dispatch(setProductData(id, data));
    },
    selectProduct: (id) => {
      dispatch(selectProduct(id));
    },
    setProductWSData: (id, wsData) => {
      dispatch(setProductWSData(id, wsData));
    },
    updateHeartbeat: (status) => {
      dispatch(updateHeartbeat(status));
    },
  }
);

const Navigation = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navbar);

export default Navigation;
