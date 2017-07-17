import React, { Component } from 'react';
import ToggleSwitch from 'react-toggle-switch';
import fileDownload from 'react-file-download';
import Dropzone from 'react-dropzone';
import axios from 'axios';

import Input from '../../../components/Input';
import Dropdown from '../../../components/Dropdown';
import { getAccounts, setOrderBook } from '../../../utils/api';


export default class ProfileForm extends Component {
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
      getAccounts(this.state.profile.session).then((res) => {
        if (res) this.props.updateAccounts(res);
      });
    }
    this.props.saveProfile({ profile: this.state.profile });
    console.log(this.state.profile.selectedProducts);
    for (let i = 0; i < this.state.profile.selectedProducts.length; i += 1) {
      setOrderBook(this.state.profile.selectedProducts[i].value, this.props.updateOrderBook);
    }
  }

  handleImport = (acceptedFiles) => {
    const instance = axios.create({ baseURL: '' });
    instance.get(acceptedFiles[0].preview).then((d) => {
      this.props.importProfile(d.data);
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
          <button type="submit" className="form-group btn-med" onClick={this.handleSave}>
            Save
          </button>
          <label className="form-group" htmlFor="live">Live</label>
          <ToggleSwitch
            className="form-group"
            on={this.state.profile.live}
            onClick={this.handleToggle}
          />
          <label className="form-group" htmlFor="session">Session</label>
          <Input
            className="form-group"
            name="session"
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
          <label className="form-group" htmlFor="settings">Settings</label>
          <div className="import-export">
            <Dropzone className="dropzone" onDrop={this.handleImport}>
              <button type="submit" className="form-group btn-small" onClick={(e) => { e.preventDefault(); }}>
                Import
              </button>
            </Dropzone>
            <button type="submit" className="form-group btn-small" onClick={this.handleExport}>
              Export
            </button>
          </div>
        </form>
      </div>
    );
  }
}
