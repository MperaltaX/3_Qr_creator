import React from 'react';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  );
};

export default Input;
