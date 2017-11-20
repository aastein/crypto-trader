import React from 'react';

const ConnectedGlyph = ({ connected }) => (
  <div className="anchor">
    <div className="connected-glyph">
      <span className="label">Realtime data</span>
      <span
        className={`glyphicon glyphicon-dot chart-header-item
          ${connected ? 'connected' : ''}`
        }
      />
    </div>
  </div>
);

export default ConnectedGlyph;

