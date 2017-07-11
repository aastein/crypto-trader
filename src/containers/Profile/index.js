import { connect } from 'react-redux'
import { importProfile, saveProfile, updateAccounts } from '../../actions'
import ProfileForm from './components/ProfileForm'

const mapStateToProps = state => {
  return {
    profile: state.profile,
    scripts: state.scripts,
    indicators: state.chart.indicators,
    products: state.chart.products.map( p => (
      {
        id: p.id,
        granularity: p.granularity,
        range: p.range,
        docSelected: p.docSelected,
        active: p.active
      }  
    )),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    importProfile: userData => {
      dispatch(importProfile(userData))
    },
    saveProfile: settigns => {
      dispatch(saveProfile(settigns))
    },
    updateAccounts: accounts => {
      dispatch(updateAccounts(accounts))
    }
  }
}

const Profile = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm)

export default Profile
