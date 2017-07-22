import { connect } from 'react-redux';
import React, { Component } from 'react';
import ToggleSwitch from 'react-toggle-switch';
import fileDownload from 'react-file-download';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

import {
  saveProfile,
  fetchAccounts,
  fetchOrderBook,
  setLocation,
  fetchSettings,
} from '../actions';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';

class Profile extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    scripts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      script: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
      live: PropTypes.bool.isRequired,
    })).isRequired,
    indicators: PropTypes.arrayOf(PropTypes.object).isRequired,
    products: PropTypes.arrayOf(PropTypes.shape(
      {
        id: PropTypes.string,
        display_name: PropTypes.string,
        granularity: PropTypes.number,
        range: PropTypes.number,
        docSelected: PropTypes.bool,
        active: PropTypes.bool,
      },
    )).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.profile,
      scripts: this.props.scripts,
      indicators: this.props.indicators,
      products: this.props.products,
    };
    this.state = { ...this.state, textState: JSON.stringify(this.state, null, 2) };
  }

  componentDidMount() {
    this.props.setLocation(this.props.location);
  }
  // only render if profile, product length, or internal state changed
  shouldComponentUpdate(nextProps, nextState) {
    const profileChanged = JSON.stringify(this.props.profile)
      !== JSON.stringify(nextProps.profile);
    const stateChanged = JSON.stringify(this.state)
      !== JSON.stringify(nextState);
    const productLengthChanged = this.props.products.length !== nextProps.products.length;
    return profileChanged || stateChanged || productLengthChanged;
  }

  onSelectProducts = (value) => {
    const selectedProducts = value;
    this.setState(prevState => (
       { profile: { ...prevState.profile, selectedProducts } }
    ));
  }

  handleInputChange = (key, event) => {
    const session = event.target.value;
    this.setState(prevState => (
       { profile: { ...prevState.profile, session } }
    ));
  }

  handleTextAreaChange = (event) => {
    const text = event.target.value;
    this.setState(() => (
      { textState: text }
    ));
  }

  handleToggle = () => {
    this.setState(prevState => (
      { profile: { ...prevState.profile, live: !prevState.profile.live } }
    ));
  }

  handleSave = (event) => {
    event.preventDefault();
    if (this.state.profile.session.length > 0) {
      this.props.fetchAccounts(this.state.profile.session);
    }
    this.props.saveProfile({ profile: this.state.profile });
    for (let i = 0; i < this.state.profile.selectedProducts.length; i += 1) {
      this.props.fetchOrderBook(this.state.profile.selectedProducts[i].value);
    }
    this.setState(() => (
      { ...this.state, textState: JSON.stringify(this.state, null, 2) }
    ));
  }

  handleImport = (acceptedFiles) => {
    this.props.fetchSettings(acceptedFiles).then((data) => {
      this.setState({
        profile: data.profile,
        scripts: data.scripts,
        indicators: data.indicators,
        products: data.products,
        textState: JSON.stringify(data, null, 2),
      });
    });
  }

  handleExport = (event) => {
    event.preventDefault();
    fileDownload(this.state.textState, 'user_state.json');
  }

  render() {
    return (
      <div className="profile">
        <form onSubmit={this.props.onSaveClick}>
          <div className="form-buttons">
            <button type="submit" className="form-group btn-small" onClick={this.handleSave}>
              Save
            </button>
            <Dropzone className="dropzone" onDrop={this.handleImport}>
              <button type="submit" className="form-group btn-small" onClick={(e) => { e.preventDefault(); }}>
                Import
              </button>
            </Dropzone>
            <button type="submit" className="form-group btn-small" onClick={this.handleExport}>
              Export
            </button>
          </div>
          <label className="form-group" htmlFor="live">Live</label>
          <ToggleSwitch
            className="form-group"
            on={this.state.profile.live}
            onClick={this.handleToggle}
          />
          <label className="form-group" htmlFor="session">Session</label>
          <Input
            className="form-group"
            inputName="session"
            placeholder="Session"
            value={this.state.profile.session}
            onChange={this.handleInputChange}
          />
          <label className="form-group" htmlFor="watched-products">Watched Products</label>
          <Dropdown
            className="form-group"
            multi
            simpleValue
            options={this.props.products.map(p => ({ label: p.display_name, value: p.id }))}
            onChange={this.onSelectProducts}
            value={this.state.profile.selectedProducts}
          />
        </form>
      </div>
    );
  }
}


const mapStateToProps = state => (
  {
    profile: state.profile,
    scripts: state.scripts,
    indicators: state.chart.indicators,
    products: state.chart.products.map(p => (
      {
        id: p.id,
        display_name: p.display_name,
        granularity: p.granularity,
        range: p.range,
        docSelected: p.docSelected,
        active: p.active,
      }
    )),
  }
);

const mapDispatchToProps = dispatch => (
  {
    fetchSettings: acceptedFiles => (
      dispatch(fetchSettings(acceptedFiles))
    ),
    saveProfile: (settigns) => {
      dispatch(saveProfile(settigns));
    },
    fetchAccounts: (session) => {
      dispatch(fetchAccounts(session));
    },
    fetchOrderBook: (id) => {
      dispatch(fetchOrderBook(id));
    },
    setLocation: (location) => {
      dispatch(setLocation(location));
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
