import { connect } from 'react-redux';
import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

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
  findSession,
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
      exportedState: {
        profile: this.props.profile,
        scripts: this.props.scripts,
        indicators: this.props.indicators,
        products: this.props.products,
      },
      sessionIdPaths: [
        {
          os: 'OSX',
          browser: 'Chrome',
          path: '~/Library/Application Support/Google/Chrome/Default/Web Data',
        },
      ],
    };
    this.state = { ...this.state, textState: JSON.stringify(this.state.exportedState, null, 2) };
  }

  componentDidMount() {
    this.props.setLocation(this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      exportedState: {
        profile: nextProps.profile,
        scripts: nextProps.scripts,
        indicators: nextProps.indicators,
        products: nextProps.products,
      },
    });
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
    if (this.state.exportedState.profile.session.length > 0) {
      this.props.fetchAccounts(this.state.exportedState.profile.session);
    }
    this.props.saveProfile({ profile: this.state.exportedState.profile });
    for (let i = 0; i < this.state.exportedState.profile.selectedProducts.length; i += 1) {
      this.props.fetchOrderBook(this.state.exportedState.profile.selectedProducts[i].value);
    }
    this.setState(() => (
      { ...this.state, textState: JSON.stringify(this.state.exportedState, null, 2) }
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

  handleFindSession = (acceptedFiles) => {
    this.props.findSession(acceptedFiles);
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
            <button type="submit" className="form-group btn-small btn-export" onClick={this.handleExport}>
              Export
            </button>
          </div>
          <label className="form-group" htmlFor="live">Live</label>
          <ToggleSwitch
            className="form-group"
            on={this.state.exportedState.profile.live}
            onClick={this.handleToggle}
          />
          <label className="form-group" htmlFor="session">Session</label>
          <Input
            className="form-group"
            name="session"
            placeholder="Session"
            value={this.state.exportedState.profile.session}
            onChange={this.handleInputChange}
          />
          <label className="form-group" htmlFor="help">{'Can\'t find your session ID?'}</label>
          <p>
            {'Session data is stored by your browser. You can upload browser data and the app will try to find your session.'}
          </p>
          <table className="profile-table">
            <tbody>
              <tr>
                <th>OS</th>
                <th>Browser</th>
                <th>Path</th>
              </tr>
              {
                this.state.sessionIdPaths.map(s => (
                  (
                    <tr key={s.os}>
                      <td>{s.os}</td>
                      <td>{s.browser}</td>
                      <td>{s.path}</td>
                      <td>
                        <CopyToClipboard
                          onCopy={() => {}}
                          text={s.path}
                        >
                          <button className="form-group btn-small" onClick={(e) => { e.preventDefault(); }}>
                            Copy
                          </button>
                        </CopyToClipboard>
                      </td>
                    </tr>
                  )
                ))
              }
            </tbody>
          </table>
          <Dropzone className="dropzone" onDrop={this.handleFindSession}>
            <button type="submit" className="form-group btn-small" onClick={(e) => { e.preventDefault(); }}>
              Find Session
            </button>
          </Dropzone>
          <label className="form-group" htmlFor="watched-products">Watched Products</label>
          <Dropdown
            className="form-group"
            multi
            simpleValue
            options={this.props.products.map(p => ({ label: p.display_name, value: p.id }))}
            onChange={this.onSelectProducts}
            value={this.state.exportedState.profile.selectedProducts}
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
    findSession: (acceptedFiles) => {
      dispatch(findSession(acceptedFiles));
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
