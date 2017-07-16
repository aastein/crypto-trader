import React from 'react';
import moment from 'moment';

const Log = ({ log }) => (
  (
    <div className="log">
      <h2>
        History
      </h2>
      <div className="log-messages">
        { log.map((l, i) => (
          (
            <p className="" key={l.time + l.message + i}>{`${moment(l.time).format('h:mm:ss a')}: ${l.message}`}</p>
          )
        ))}
      </div>
    </div>
  )
);

export default Log;
