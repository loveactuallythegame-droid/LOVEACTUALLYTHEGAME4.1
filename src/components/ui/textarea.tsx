import React from 'react';

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea className="px-3 py-2 border rounded" {...props} />
);

export default Textarea;
