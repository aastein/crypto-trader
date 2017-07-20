import React, { Component } from 'react';

import run from '../../../utils/scriptEnv';
import test from '../../../utils/scriptTestEnv';

export default class CodeEditor extends Component {

  // only render if script data changed
  shouldComponentUpdate(nextProps, nextState) {
    const scriptChanged = JSON.stringify(this.props.script)
      !== JSON.stringify(nextProps.script);
    return scriptChanged;
  }

  handleTextAreaChange = (event) => {
    const script = { ...this.props.script, script: event.target.value };
    this.props.saveScript(script);
  }

  handleInputChange = (event) => {
    const name = event.target.value;
    this.props.saveScript({ ...this.props.script, name });
  }

  runScript = (event) => {
    event.preventDefault();
    run(this.props.scriptHeader, this.props.script.script, this.props.products, this.props.profile, this.props.appendLog,
      this.props.addOrder);
  }

  testScript = (event) => {
    event.preventDefault();
    const result = test(this.props.scriptHeader, this.props.script.script, this.props.products, this.props.appendLog);
    this.props.saveTestResult(result);
  }

  deleteScript = (event) => {
    event.preventDefault();
    this.props.deleteScript(this.props.script.id);
  }

  render() {
    return (
      <div className="code-editor">
        <form onSubmit={this.handleSave}>
          <div className="code-editor-header">
            <span>Script Name:</span>
            <input
              className="name-input"
              type="input"
              value={this.props.script.name}
              onChange={this.handleInputChange}
            />
            { this.props.script.id !== 0 &&
            <button className="btn-delete" onClick={this.deleteScript}>Delete</button> }
          </div>
          <div className="textarea">
            <textarea
              rows={'3'}
              cols={'30'}
              value={this.props.script.script}
              onChange={this.handleTextAreaChange}
            />
          </div>
          { this.props.script.id !== 0 &&
          <div className="action-buttons">
            <button className="btn-run" onClick={this.runScript}>Run</button>
            <button className="btn-test" onClick={this.testScript}>Test</button>
          </div> }
        </form>
      </div>
    );
  }
}
