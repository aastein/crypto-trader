import React from 'react'
import Select from 'react-select';

export const Dropdown = ({ multi, options, onChange, value }) => (
  <div>
    <Select
      multi={multi}
      name="form-field-name"
      value={value}
      options={options}
      onChange={onChange}
    />
  </div>
)
