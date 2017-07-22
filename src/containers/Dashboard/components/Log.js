import React, { Component } from 'react';
import moment from 'moment';

export default class Log extends Component {

  // only render if log data changed
  shouldComponentUpdate(nextProps, nextState) {
    const logsChanged = JSON.stringify(this.props.log)
      !== JSON.stringify(nextProps.log);
    return logsChanged;
  }
  render() {
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
