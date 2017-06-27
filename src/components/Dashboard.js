import React, { Component } from 'react'
import Chart from './Chart'
import Scratchpad from './Scratchpad'
const log = 'Trade initated:\nTo: rn34tv34t3232v4t3b4345\nFrom: 2avw4tw4ra3ra3wrawb3raw3wrw\nTrade complete: Sold 3.53 mBTC for 1.2 LTC\n\n'

export default class Dashboard extends Component {

  render() {
    return (
      <div className='dashboard'>
        <div className='container dashboard-top'>
          <div className='col-md-8'>
            <Chart />
          </div>
          <div className='col-md-4'>
            {log}
          </div>
        </div>
        <div className='container dashboard-bottom'>
          <div className='col-md-12'>
            <Scratchpad />
          </div>
        </div>
      </div>
    )
  }
}
