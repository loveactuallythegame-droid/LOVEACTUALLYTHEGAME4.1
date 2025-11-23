import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }> = ({ children, className = '', ...rest }) => (
  <button className={`px-4 py-2 rounded ${className}`} {...rest}>{children}</button>
);

export default Button;
