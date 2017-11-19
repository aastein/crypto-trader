import React, { Component } from 'react';

import run from '../../utils/scriptEnv';
import test from '../../utils/scriptTestEnv';

export default class CodeEditor extends Component {

  // only render if script data changed
  // shouldComponentUpdate(nextProps, nextState) {
  //   const scriptChanged = JSON.stringify(this.props.script)
  //     !== JSON.stringify(nextProps.script);
  //   return scriptChanged;
  // }

  handleTextAreaChange = (event) => {
    const script = { ...this.props.script, script: event.target.value };
    this.props.saveScript(script);
  }

  handleTabKey = (event) => {
    if (event.keyCode === 9) { // tab was pressed
      event.preventDefault();
      const val = this.props.script.script,
        start = event.target.selectionStart,
        end = event.target.selectionEnd,
        spaces = '  ';
      const script = { ...this.props.script, script: val.substring(0, start) + spaces + val.substring(end) };
      this.props.saveScript(script).then(() => {
        this.refs.textarea.selectionStart = start + spaces.length;
        this.refs.textarea.selectionEnd = this.refs.textarea.selectionStart;
      });
    }
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
    console.log('rendering CodeEditor');
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
              ref={'textarea'}
              value={this.props.script.script}
              onChange={this.handleTextAreaChange}
              onKeyDown={this.handleTabKey}
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
