import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class Log extends Component {

  // only render if log data changed
  shouldComponentUpdate(nextProps, nextState) {
    const logsChanged = JSON.stringify(this.props.log)
      !== JSON.stringify(nextProps.log);
    return logsChanged;
  }
  render() {
    console.log('rendering log');
    return (
      <div className="log">
        <h2>
          History
        </h2>
        <div className="log-messages">
          { this.props.log.map((l, i) => ((
            <p className="" key={`${l.time}${i}`}>
              {`${moment(l.time).format('h:mm:ss a')}: ${l.message}`}
            </p>
          )))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const log = state.log;
  return ({
    log,
  })
};

const LogContainer = connect(
  mapStateToProps,
  null,
)(Log);

export default LogContainer;
