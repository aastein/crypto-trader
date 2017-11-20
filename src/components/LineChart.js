import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts/ReactHighcharts.src';
import PropTypes from 'prop-types';


export default class PriceChart extends Component {

  shouldComponentUpdate = nextProps => (false)

  render() {
    console.log('linechart config', this.props.config);
    return (
      <div className="line-chart" >
        <ReactHighcharts config={this.props.config} ref={(c) => { this[this.props.refName] = c; }} />
      </div>
    );
  }
}

PriceChart.propTypes = {
  config: PropTypes.object.isRequired,
};
