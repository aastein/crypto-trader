import { connect } from 'react-redux'
import { updateAccounts } from '../../actions'
import Navbar from './components/Navbar'

const mapStateToProps = state => {
  return {
    live: state.profile.live,
    accounts: state.profile.accounts,
    session: state.profile.session
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateAccounts: accounts => {
      dispatch(updateAccounts(accounts))
    }
  }
}

const Navigation = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)

export default Navigation
