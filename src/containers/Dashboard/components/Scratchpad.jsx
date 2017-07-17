import React, { Component } from 'react';

import CodeEditor from './CodeEditor';
import ProductDataList from './ProductDataList';
import ScriptList from './ScriptList';

export default class Scratchpad extends Component {

  // only render if
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    const activeScript = this.props.scripts.reduce((a, b) => (
      b.active ? b : a
    ), {});
    const scriptHeader = this.props.scripts[0].script;

    return (
      <div className={this.props.className}>
        <ScriptList
          scripts={this.props.scripts}
          addNew={this.props.addScript}
          toggleScriptLive={this.props.toggleScriptLive}
          onScriptClick={this.props.selectScript}
        />
        <CodeEditor
          products={this.props.products}
          profile={this.props.profile}
          scriptHeader={scriptHeader}
          script={activeScript}
          addOrder={this.props.addOrder}
          appendLog={this.props.appendLog}
          deleteScript={this.props.deleteScript}
          saveScript={this.props.saveScript}
          saveTestResult={this.props.saveTestResult}
          updateAccounts={this.props.updateAccounts}
        />
        <ProductDataList products={this.props.products} onClick={this.props.selectProductDoc} />
      </div>
    );
  }
}
