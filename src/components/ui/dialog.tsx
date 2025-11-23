import React from 'react';

export const Dialog: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={className} {...rest}>{children}</div>
);
export const DialogTrigger: React.FC<any> = ({ children, className = '', ...rest }) => (
  <button className={className} {...rest}>{children}</button>
);
export const DialogContent: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={className} {...rest}>{children}</div>
);
export const DialogHeader: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={className} {...rest}>{children}</div>
);
export const DialogTitle: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={className} {...rest}>{children}</div>
);
export const DialogDescription: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={className} {...rest}>{children}</div>
);

export default Dialog;
