import React from 'react';

export const Select: React.FC<{ value?: string; onValueChange?: (v: string) => void; children?: React.ReactNode; disabled?: boolean }> = ({ value, onValueChange, children, disabled = false }) => (
  <select
    className="p-2 border rounded"
    value={value}
    disabled={disabled}
    onChange={(e) => onValueChange && onValueChange(e.target.value)}
  >
    {children}
  </select>
);

export const SelectContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => <div>{children}</div>;
export const SelectItem: React.FC<{ value?: string; children?: React.ReactNode }> = ({ children, value }) => (
  <option value={value}>{children}</option>
);
export const SelectTrigger: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => <div className={className}>{children}</div>;
export const SelectValue: React.FC<{ value?: string; children?: React.ReactNode; placeholder?: string }> = ({ children, placeholder }) => <span>{children ?? placeholder}</span>;

export default Select;
