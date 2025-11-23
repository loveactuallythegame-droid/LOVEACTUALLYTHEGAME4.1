import React from 'react';

export const Switch: React.FC<{
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  ariaLabel?: string;
}> = ({ checked, onCheckedChange, className = '', ariaLabel }) => (
  <label className={`inline-flex items-center cursor-pointer ${className}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
    />
    <span className="ml-2">{ariaLabel || ''}</span>
  </label>
);

export default Switch;
