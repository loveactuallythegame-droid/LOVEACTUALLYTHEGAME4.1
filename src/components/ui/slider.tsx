import React from 'react';

export const Slider: React.FC<any> = ({ children, className = '', ...rest }) => (
  <input type="range" className={className} {...rest} />
);

export default Slider;
