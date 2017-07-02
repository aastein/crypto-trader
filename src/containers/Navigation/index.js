import { connect } from 'react-redux'
import Navbar from './components/Navbar'

const mapStateToProps = state => {
  return { live: state.profile.live }
}

const Navigation = connect(
  mapStateToProps
)(Navbar)

export default Navigation
