import React, { Component } from 'react';
import { ObjectInspector } from 'react-inspector';

export default class ProductDataList extends Component {
  // only render if product price data changed or product doc selection changed
  shouldComponentUpdate(nextProps, nextState) {
    const thisData = this.props.products.map(p => (
      p.data.length
    ));
    const nextData = nextProps.products.map(p => (
      p.data.length
    ));
    const thisSelectedDocs = this.props.products.map(p => (
      p.docSelected
    ));
    const nextSelectedDocs = nextProps.products.map(p => (
      p.docSelected
    ));
    const dataChanged = JSON.stringify(thisData)
      !== JSON.stringify(nextData);
    const selectedDocsChanged = JSON.stringify(thisSelectedDocs)
      !== JSON.stringify(nextSelectedDocs);
    return dataChanged || selectedDocsChanged;
  }

  render() {
    console.log('rendering ProductDataList');
    return (
      <div className="doc-list">
        <h2>
          Product Data
        </h2>
        <div className="docs">
          { this.props.products.map(p => (
            <div key={p.id}>
              <button
                className="list-button"
                onClick={() => this.props.onClick(p.id)}
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
  }
}
