import React, { Component } from 'react'


export default class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      destinationAddress: '',
      refundAddress: ''
    }

    this.handleDestChange = this.handleDestChange.bind(this)
    this.handleRefChange = this.handleRefChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleDestChange(event) {
    this.setState({destinationAddress: event.target.value});
  }

  handleRefChange(event) {
    this.setState({refundAddress: event.target.value});
  }

  handleSubmit(event) {
    console.log('event')
    alert('A form was submitted: ' + JSON.stringify(this.state, null, 2));
    event.preventDefault();
  }

  render() {
    return (
      <div className='login-background'>
        <div className='login'>
          <div>
            <span>Temporary wallet address:</span>
            <span className='temp-addr'>1ioCfmQ8ESNf9AbchuNkUKuCiXtspSYBm</span>
          </div>
          <form className='info-form' onSubmit={this.handleSubmit}>
            <label>
              Destination Address:
              <input
                className='dest-addr'
                onChange={this.handleDestChange}
                type='text'
                value={this.state.destinationAddress}
              />
            </label>
            <label>
              Refund Address:
              <input
                className='ref-addr'
                onChange={this.handleRefChange}
                type='text'
                value={this.state.refundAddress}
              />
            </label>
            <input
              className='submit-bttn'
              type="submit"
              value="Submit" />
          </form>
        </div>
      </div>
    )
  }
}
