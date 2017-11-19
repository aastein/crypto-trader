import React, { Component } from 'react';
import ToggleSwitch from 'react-toggle-switch';

export default class ScriptList extends Component {

  // only render if script data changed
  shouldComponentUpdate(nextProps, nextState) {
    const scriptsChanged = JSON.stringify(this.props.scripts)
        !== JSON.stringify(nextProps.scripts);
    return scriptsChanged;
  }

  render() {
    console.log('rendering ScriptList');
    return (
      <div className="script-list">
        <h2>
          Scripts
        </h2>
        <div className="scripts">
          <button
            className="list-button-add"
            key="add-new"
            onClick={() => this.props.addNew()}
          >
            Add New
          </button>
          { this.props.scripts.map((script, i) => (
            <div key={script.id} className={`list-item ${script.active ? 'active' : ''}`}>
              <button
                className="list-button"
                onClick={() => this.props.onScriptClick(script.id)}
              >
                {script.name}
              </button>
              {i !== 0 && <ToggleSwitch
                on={script.live}
                onClick={() => this.props.toggleScriptLive(script.id)}
              />}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
