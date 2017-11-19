import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  addScript,
  saveScript,
  deleteScript,
  selectScript,
  toggleScriptLive,
} from '../../actions';

import CodeEditor from '../CodeEditor';
import ProductDataList from '../ProductDataList';
import ScriptList from '../ScriptList';

class Scratchpad extends Component {

  render() {
    const activeScript = this.props.scripts.reduce((a, b) => (
      b.active ? b : a
    ), {});
    const scriptHeader = this.props.scripts[0].script;
    console.log('rendering scratchpad container');
    return (
      <div className="bottom-container">
        <div className="script-container">
          <ScriptList
            scripts={this.props.scripts}
            addNew={this.props.addScript}
            toggleScriptLive={this.props.toggleScriptLive}
            onScriptClick={this.props.selectScript}
          />
          <CodeEditor
            scriptHeader={scriptHeader}
            script={activeScript}
            deleteScript={this.props.deleteScript}
            saveScript={this.props.saveScript}
          />
        </div>
        <ProductDataList products={[]} onClick={e => {e.preventDefault()}} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const scripts = state.scripts;
  return ({
    scripts,
  })
};

const mapDispatchToProps = dispatch => (
  {
    addScript: () => {
      dispatch(addScript());
    },
    saveScript: (script) => (
      dispatch(saveScript(script))
    ),
    deleteScript: (id) => {
      dispatch(deleteScript(id));
    },
    selectScript: (id) => {
      dispatch(selectScript(id));
    },
    toggleScriptLive: (id) => {
      dispatch(toggleScriptLive(id));
    },
  }
);

const ScratchpadContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scratchpad);

export default ScratchpadContainer;
