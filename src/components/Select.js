import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleExpand = (event) => {
    event.preventDefault();
    this.setState(prevState => (
      { expanded: !prevState.expanded }
    ));
  }

  render() {
    return (
      <div className={`dropdown ${this.props.className}`}>
        <div className="dropdown-toggle Select-control" role="menu" onClick={this.handleExpand} tabIndex={0}>
          <span className="Select-value-label">{this.props.value}</span>
          <span className="Select-arrow-zone">
            <span className="Select-arrow" />
          </span>
        </div>
        { this.state.expanded &&
          <div className="dropdown-menu" aria-hidden>
            {
              this.props.options.map((o, i) => (
                <div key={`${o.value}${i}`}className="dropdown-item Select-option">
                  <span className="item-label">{o.label}</span>
                  <div className="item-options">
                    <input
                      defaultChecked={o.active}
                      className="item-checkbox"
                      type="checkbox"
                      onChange={(e) => { this.props.onCheck(o.value); }}
                    />
                    <div className="item-drilldown" role="button" onClick={(e) => { this.props.handleDrilldown(o.value); }} tabIndex={0}>
                      <FontAwesome name="chevron-right" />
                    </div>
                  </div>
                </div>
              ))
            }
          </div> }
      </div>
    );
  }
}

export default Select;
