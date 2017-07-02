import React, { Component }from 'react'
import PropTypes from 'prop-types'
import ToggleSwitch from 'react-toggle-switch';
import { Input } from '../../../components/Input'
import { getAccounts } from '../../../utils/api'

export default class ProfileForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiKey: props.apiKey,
      secret: props.secret,
      password: props.password,
      live: props.live,
    }
  }

  handleInputChange = (key, event) => {
    let o = {}
    o[key] = event.target.value
    this.setState(() => {
      return o
    })
  }

  handleToggle = () => {
    this.setState((prevState) => (
      { live: !prevState.live }
    ))
  }

  handleSave = (event) => {
    event.preventDefault()
    getAccounts(this.state.apiKey, this.state.secret, this.state.passoword)
    this.props.onClick(this.state)
  }

  render(){
    return (
      <div className='profile col-md-6 col-md-offset-3'>
        <form onSubmit={this.props.onSaveClick}>
          <div className='form-group'>
            <label>API Key</label>
            <Input name='apiKey' placeholder='API Key' value={this.state.apiKey} onChange={this.handleInputChange}/>
          </div>
          <div className='form-group'>
            <label>Secret</label>
            <Input name='secret' placeholder='Secret' value={this.state.secret} onChange={this.handleInputChange}/>
          </div>
          <div className='form-group'>
            <label>Password</label>
            <Input name='password' placeholder='Password' value={this.state.password} onChange={this.handleInputChange} />
          </div>
          <div className='form-group'>
            <label>Live</label>
            <div>
              <ToggleSwitch
                on={this.state.live}
                onClick={this.handleToggle}
              />
            </div>
          </div>
          <button type='submit' className='btn btn-primary' onClick={this.handleSave}>
            Save
          </button>
        </form>
      </div>
    )
  }
}

ProfileForm.propTypes = {
  apiKey: PropTypes.string.isRequired,
  secret: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  live: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}
