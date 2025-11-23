import React from 'react';

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = '', ...rest }) => (
  <label className={`block text-sm font-medium ${className}`} {...rest}>{children}</label>
);

export default Label;
