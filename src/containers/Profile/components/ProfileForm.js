import React, { Component }from 'react'
import ToggleSwitch from 'react-toggle-switch';
import { Input } from '../../../components/Input'
import { Dropdown } from '../../../components/Dropdown'
import { getAccounts } from '../../../utils/api'

export default class ProfileForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      profile: this.props.profile,
      scripts: this.props.scripts,
      indicators: this.props.indicators,
    }
    this.state = { ...this.state, 'textState': JSON.stringify(this.state, null, 2)}
  }

  handleInputChange = (key, event) => {
    let session = event.target.value
    this.setState((prevState) => (
       { profile: { ...prevState.profile, session } }
    ))
  }

  handleTextAreaChange = (event) => {
    let text = event.target.value
    this.setState(() => (
      { textState: text }
    ))
  }

  handleToggle = () => {
    this.setState((prevState) => (
      { profile: { ...prevState.profile, live: !prevState.profile.live } }
    ))
  }

  handleSave = (event) => {
    event.preventDefault()
    getAccounts(this.state.profile.session)
    this.props.saveProfile({ profile: this.state.profile })
  }

  handleImport = (event) => {
    event.preventDefault()
    this.props.importProfile(JSON.parse(this.state.textState))
  }

  onSelectProducts = (value) => {
    let selectedProducts = value
    this.setState((prevState) => (
       { profile: { ...prevState.profile, selectedProducts } }
    ))
  }

  render(){
    return (
      <div className='profile col-md-6 col-md-offset-3'>
        <form onSubmit={this.props.onSaveClick}>
          <button type='submit' className='btn btn-primary' onClick={this.handleSave}>
            Save
          </button>
          <div className='form-group'>
            <label>Live</label>
            <div>
              <ToggleSwitch
                on={this.state.profile.live}
                onClick={this.handleToggle}
              />
            </div>
          </div>
          <div className='form-group'>
            <label>Session</label>
            <Input name='session' placeholder='Session' value={this.state.profile.session} onChange={this.handleInputChange}/>
          </div>
          <div className='product-multi-select'>
            <label>Watched Products</label>
            <Dropdown
              multi
              simpleValue
              options={this.props.products.map( p => ({label:p.display_name, value: p.id}))}
              onChange={this.onSelectProducts}
              value={this.state.profile.selectedProducts}
            />
          </div>
          <div>
            <label>User State</label>
            <textarea className='form-group col-md-12' rows={'3'} cols={'30'} value={this.state.textState} onChange={this.handleTextAreaChange} />
          </div>
        </form>
      </div>
    )
  }
}
