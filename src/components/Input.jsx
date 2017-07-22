import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ className, maxLength, name, onChange, placeholder, type, value }) => (
  (
    <div>
      <input
        className={className}
        maxLength={maxLength}
        name={name}
        onChange={e => onChange(name, e)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  )
);

Input.propTypes = {
  className: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

Input.defaultProps = {
  maxLength: Number.MAX_SAFE_INTEGER,
  placeholder: '',
  value: '',
  type: 'text',
};

export default Input;
