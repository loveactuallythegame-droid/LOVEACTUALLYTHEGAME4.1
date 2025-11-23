import React from 'react';

export const Tabs: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={className} {...rest}>{children}</div>
);
export const TabsList: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={className} {...rest}>{children}</div>
);
export const TabsTrigger: React.FC<any> = ({ children, className = '', ...rest }) => (
  <button className={className} {...rest}>{children}</button>
);
export const TabsContent: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={className} {...rest}>{children}</div>
);

export default Tabs;
