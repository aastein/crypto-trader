import React from 'react';
import PropTypes from 'prop-types';

const Input = props => (
  (
    <div>
      <input
        className={`${props.className} ${props.invalid ? 'invalid' : ''}`}
        maxLength={props.maxLength}
        name={props.inputName}
        onChange={e => props.onChange(name, e)}
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
      />
    </div>
  )
);

Input.propTypes = {
  className: PropTypes.string.isRequired,
  invalid: PropTypes.bool,
  maxLength: PropTypes.number,
  inputName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

Input.defaultProps = {
  invalid: false,
  maxLength: Number.MAX_SAFE_INTEGER,
  placeholder: '',
  value: '',
  type: 'text',
};

export default Input;
