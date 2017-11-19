import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showCard } from '../../actions'

class CardHeader extends Component {

 handleClick = (e, content) => {
    e.preventDefault();
    this.props.showCard(this.props.position, content);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  render() {
    console.log('rendering CardHeader:', this.props.position);
    return (
      <div>
        <div className="card-header">
            {
              this.props.contentOptions.map(content => {
                return (<button
                  key={content}
                  className="btn btn-primary header-button"
                  onClick={e => {this.handleClick(e, content)}}>{ content }</button>)
              })
            }
          </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showCard: (card, content) => (
      dispatch(showCard(card, content))
    ),
  }
}

const CardHeaderContainer = connect(
  null,
  mapDispatchToProps,
)(CardHeader);

export default CardHeaderContainer;

