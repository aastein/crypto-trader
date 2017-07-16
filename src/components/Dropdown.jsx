import React from 'react';
import Select from 'react-select';

const Dropdown = ({ multi, options, onChange, value, className }) => (
  <div>
    <Select
      className={className}
      multi={multi}
      name="form-field-name"
      value={value}
      options={options}
      onChange={onChange}
    />
  </div>
);

export default Dropdown;
