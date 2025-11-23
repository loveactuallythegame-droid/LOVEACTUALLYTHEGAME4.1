import React from 'react';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input className="px-3 py-2 border rounded" {...props} />
);

export default Input;
