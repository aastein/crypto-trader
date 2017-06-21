import React, { Component } from 'react'
import Navigation from '../components/Navigation'
import Chart from '../components/Chart'

export default class Charts extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <h1>Charts</h1>
        <Chart />
      </div>
    )
  }
}
