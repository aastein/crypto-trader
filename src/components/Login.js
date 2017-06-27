import React, { Component } from 'react'
import { Redirect } from 'react-router'


export default class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      destinationAddress: '',
      refundAddress: '',
      allFormsFilled: false
    }

    this.handleDestChange = this.handleDestChange.bind(this)
    this.handleRefChange = this.handleRefChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  checkAllFormsFilled(){
    if(this.state.destinationAddress && this.state.refundAddress){
      console.log('all forms filled')
    }
  }

  handleDestChange(event) {
    this.setState({destinationAddress: event.target.value});
  }

  handleRefChange(event) {
    this.setState({refundAddress: event.target.value});
  }

  handleSubmit(event) {
    console.log('event')
    if(this.state.destinationAddress && this.state.refundAddress){
      this.setState({allFormsFilled: true});
    } else {
      let stlye={ border: '1px solid #f00' }
    }
    event.preventDefault();
  }

  render() {
    const shouldRedirect = this.state.allFormsFilled
    return (
      <div className='container'>
        <div className='row vertical-center'>
          <div className='col-md-6 col-md-offset-3'>
            <div className='panel drop-shadow'>
              <div className='panel-heading text-center'>
                <div className='row'>
                  <div className='col-xs-12'>
                    <span>Temporary wallet address:</span>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-xs-12 col-sx-offset-6'>
                    <span className='text-danger'>1ioCfmQ8ESNf9AbchuNkUKuCiXtspSYBm</span>
                  </div>
                </div>
              </div>
              <div className='panel-body'>
                <div className='row'>
                  <div className='col-lg-12'>
                    <form onSubmit={this.handleSubmit}>
                      <div className='form-group'>
                        <input
                          className='form-control'
                          onChange={this.handleDestChange}
                          placeholder='Destination Address'
                          type='text'
                          value={this.state.destinationAddress}
                        />
                      </div>
                      <div className='form-group'>
                        <input
                          className='form-control'
                          onChange={this.handleRefChange}
                          placeholder='Refund Address'
                          type='text'
                          value={this.state.refundAddress}
                        />
                      </div>
                      <div className='form-group'>
                        <input
                          className='form-control btn btn-primary'
                          type="submit"
                          value="Submit" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        { shouldRedirect && (
          <Redirect to={'/dashboard'} />
        )}
      </div>
    )
  }
}
