import React, { Component } from 'react'

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <div className='row'>
          <div className='chart'>
            Chart Area
          </div>
          <div className='log'>
            Log area
          </div>
        </div>
        <div className='row'>
          Scratch pad
        </div>
      </div>
    )
  }
}
