import { connect } from 'react-redux'
import { saveProfile } from '../../actions'
import ProfileForm from './components/ProfileForm'

const mapStateToProps = state => {
  return {
    session: state.profile.session,
    live: state.profile.live
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClick: profile => {
      dispatch(saveProfile(profile))
    }
  }
}

const Profile = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm)

export default Profile
