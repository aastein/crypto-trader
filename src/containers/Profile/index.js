import { connect } from 'react-redux';
import { importProfile, saveProfile, updateAccounts, updateOrderBook } from '../../actions';
import ProfileForm from './components/ProfileForm';

const mapStateToProps = state => (
  {
    profile: state.profile,
    scripts: state.scripts,
    indicators: state.chart.indicators,
    products: state.chart.products.map(p => (
      {
        id: p.id,
        display_name: p.display_name,
        granularity: p.granularity,
        range: p.range,
        docSelected: p.docSelected,
        active: p.active,
      }
    )),
  }
);

const mapDispatchToProps = dispatch => (
  {
    importProfile: (userData) => {
      dispatch(importProfile(userData));
    },
    saveProfile: (settigns) => {
      dispatch(saveProfile(settigns));
    },
    updateAccounts: (accounts) => {
      dispatch(updateAccounts(accounts));
    },
    updateOrderBook: (id, orderBook) => {
      dispatch(updateOrderBook(id, orderBook));
    },
  }
);

const Profile = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileForm);

export default Profile;
