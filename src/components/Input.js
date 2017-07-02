import React from 'react'
import PropTypes from 'prop-types'

export const Input = ({ name, onChange, placeholder, value }) => {
  return (
    <div>
      <input
        className='form-control'
        onChange={(e) => onChange(name, e)}
        placeholder={placeholder}
        type='text'
        value={value}
      />
    </div>
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string
}
