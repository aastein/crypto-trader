import { connect } from 'react-redux';
import {
  importProfile,
  saveProfile,
  fetchAccounts,
  fetchOrderBook,
} from '../../actions';
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
    fetchAccounts: (session) => {
      dispatch(fetchAccounts(session));
    },
    fetchOrderBook: (id) => {
      dispatch(fetchOrderBook(id));
    },
  }
);

const Profile = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileForm);

export default Profile;
