import React from 'react';

export const Progress: React.FC<{ value?: number; className?: string }> = ({ value = 0, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded ${className}`}>
    <div style={{ width: `${Math.max(0, Math.min(100, value))}%` }} className="bg-blue-500 h-2 rounded" />
  </div>
);

export default Progress;
