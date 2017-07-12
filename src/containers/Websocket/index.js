import { connect } from 'react-redux';

import Websocket from './components/Websocket';
import { setProductData } from '../../actions';

const mapStateToProps = state => (
  {
    websocket: state.websocket,
    products: state.chart.products,
  }
);

const mapDispatchToProps = dispatch => (
  {
    setProductData: (id, data) => {
      dispatch(setProductData(id, data));
    },
  }
);

const WebsocketContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Websocket);

export default WebsocketContainer;
