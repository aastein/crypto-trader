import React from 'react'
import Select from 'react-select';

export const Dropdown = ({ options, onChange, value }) => (
  <div>
    <Select
      name="form-field-name"
      value={value}
      options={options}
      onChange={onChange}
    />
  </div>
)
