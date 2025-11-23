import React from 'react';

export const Collapsible: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const CollapsibleTrigger: React.FC<{ children?: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <button onClick={onClick} className="px-2 py-1">{children}</button>
);

export const CollapsibleContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export default Collapsible;
