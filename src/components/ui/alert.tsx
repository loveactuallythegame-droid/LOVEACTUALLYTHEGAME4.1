import React from 'react';

export const Alert: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={`p-3 rounded ${className}`} {...rest}>{children}</div>
);
export const AlertDescription: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={className} {...rest}>{children}</div>
);

export default Alert;
