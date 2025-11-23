import React from 'react';

export const Badge: React.FC<React.HTMLAttributes<HTMLDivElement> & { variant?: string }> = ({ children, className = '', ...rest }) => (
  <div className={`inline-flex items-center px-2 py-1 text-xs rounded ${className}`} {...rest}>{children}</div>
);

export default Badge;
