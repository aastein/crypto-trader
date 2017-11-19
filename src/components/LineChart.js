import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts/ReactHighstock.src';
import PropTypes from 'prop-types';


export default class PriceChart extends Component {

  shouldComponentUpdate = nextProps => (false)

  render() {
    return (
      <div className="line-chart" >
        <ReactHighcharts config={this.props.config} ref={(c) => { this.wschart = c; }} />
      </div>
    );
  }
}

PriceChart.propTypes = {
  config: PropTypes.object.isRequired,
};
