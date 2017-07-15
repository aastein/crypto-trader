import React, { Component } from 'react';
import { ObjectInspector } from 'react-inspector';
import ToggleSwitch from 'react-toggle-switch';

import run from '../../../utils/scriptEnv';
import test from '../../../utils/scriptTestEnv';
import { getAccounts } from '../../../utils/api';

const ScriptList = ({ addNew, scripts, onScriptClick, toggleScriptLive }) => (
  <div className="script-list">
    <h2>
      Product Data
    </h2>
    <div className="scripts">
      <button
        className="list-button-add"
        key="add-new"
        onClick={() => addNew()}
      >
        Add New
      </button>
      { scripts.map(script => (
        <div key={script.id} className={`list-item ${script.active ? 'active' : ''}`}>
          <button
            className="list-button"
            onClick={() => onScriptClick(script.id)}
          >
            {script.name}
          </button>
          <ToggleSwitch
            on={script.live}
            onClick={() => toggleScriptLive(script.id)}
          />
        </div>
      ))}
    </div>
  </div>
);

const ProductDataList = ({ products, onClick }) => (
  <div className="doc-list">
    <h2>
      Product Data
    </h2>
    <div className="docs">
      { products.map(p => (
        <div key={p.id}>
          <button
            className="list-button"
            onClick={() => onClick(p.id)}
          >
            {p.id.replace('-', '_')}
          </button>
          { p.docSelected &&
            <div className="doc-desc">
              <ObjectInspector data={p} name={p.display_name} />
            </div>
          }
        </div>
      ))}
    </div>
  </div>
);

class CodeEditor extends Component {

  handleTextAreaChange = (event) => {
    const script = { ...this.props.script, script: event.target.value };
    this.props.saveScript(script);
  }

  handleInputChange = (event) => {
    const name = event.target.value;
    this.props.saveScript({ ...this.props.script, name });
  }

  updateAccounts = () => {
    if (this.props.profile.session.length > 5) {
      setTimeout(() => {
        getAccounts(this.props.profile.session).then((res) => {
          this.props.updateAccounts(res);
        });
      }, 5000);
    }
  }

  runScript = (event) => {
    event.preventDefault();
    run(this.props.script.script, this.props.products, this.props.profile, this.props.appendLog,
      this.updateAccounts);
  }

  testScript = (event) => {
    event.preventDefault();
    const result = test(this.props.script.script, this.props.products, this.props.appendLog);
    this.props.saveTestResult(result);
  }

  deleteScript = (event) => {
    event.preventDefault();
    this.props.deleteScript();
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
            <button className="btn-delete" onClick={this.deleteScript}>Delete</button>
          </div>
          <div className="textarea">
            <textarea
              rows={'3'}
              cols={'30'}
              value={this.props.script.script}
              onChange={this.handleTextAreaChange}
            />
          </div>
          <div className="action-buttons">
            <button className="btn-run" onClick={this.runScript}>Run</button>
            <button className="btn-test" onClick={this.testScript}>Test</button>
          </div>
        </form>
      </div>
    );
  }
}

const Scratchpad = (props) => {
  const activeScript = props.scripts.reduce((a, b) => (
    b.active ? b : a
  ), {});

  return (
    <div className={props.className}>
      <ScriptList
        scripts={props.scripts}
        addNew={props.addScript}
        toggleScriptLive={props.toggleScriptLive}
        onScriptClick={props.selectScript}
      />
      <CodeEditor
        products={props.products}
        profile={props.profile}
        script={activeScript}
        appendLog={props.appendLog}
        deleteScript={props.deleteScript}
        saveScript={props.saveScript}
        saveTestResult={props.saveTestResult}
        updateAccounts={props.updateAccounts}
      />
      <ProductDataList products={props.products} onClick={props.selectProductDoc} />
    </div>
  );
};

export default Scratchpad;
