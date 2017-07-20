import { connect } from 'react-redux';
import {
  updateHeartbeat,
  fetchAccounts,
  fetchOrderBook,
  fetchProductData,
  initProducts,
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
    updateHeartbeat: (status) => {
      dispatch(updateHeartbeat(status));
    },
    fetchAccounts: (session) => {
      dispatch(fetchAccounts(session));
    },
    fetchOrderBook: (id) => {
      dispatch(fetchOrderBook(id));
    },
    initProducts: () => {
      dispatch(initProducts());
    },
  }
);

const Navigation = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navbar);

export default Navigation;
