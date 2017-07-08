import { connect } from 'react-redux'
import { importProfile, saveProfile } from '../../actions'
import ProfileForm from './components/ProfileForm'

const mapStateToProps = state => {
  return {
    profile: state.profile,
    scripts: state.scripts,
    indicators: state.indicators,
    products: state.chart.products,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    importProfile: userData => {
      dispatch(importProfile(userData))
    },
    saveProfile: settigns => {
      dispatch(saveProfile(settigns))
    }
  }
}

const Profile = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm)

export default Profile
