import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ name, onChange, placeholder, value, className, maxLength, type = 'text' }) => (
  (
    <div>
      <input
        className={className}
        maxLength={maxLength}
        onChange={e => onChange(name, e)}
        placeholder={placeholder || ''}
        type={type}
        value={value}
      />
    </div>
  )
);

Input.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

Input.defaultProps = {
  placeholder: '',
  value: '',
};

export default Input;
