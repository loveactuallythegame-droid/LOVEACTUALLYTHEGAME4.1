import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => (
  <div className={`rounded-md shadow-sm bg-white ${className}`} {...rest}>{children}</div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => (
  <div className={`px-4 py-2 border-b ${className}`} {...rest}>{children}</div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => (
  <div className={`font-semibold text-lg ${className}`} {...rest}>{children}</div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => (
  <div className={`p-4 ${className}`} {...rest}>{children}</div>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...rest}>{children}</p>
);

export default Card;
