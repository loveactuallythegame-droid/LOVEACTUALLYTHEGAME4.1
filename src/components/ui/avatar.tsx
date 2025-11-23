import React from 'react';

export const Avatar: React.FC<{ src?: string; size?: number; children?: React.ReactNode }> = ({ src, size = 40, children }) => (
  <div style={{ width: size, height: size, borderRadius: '9999px', overflow: 'hidden', background: '#ddd' }}>
    {src ? <img src={src} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : children}
  </div>
);

export default Avatar;
