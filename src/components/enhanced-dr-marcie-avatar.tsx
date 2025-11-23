import React from 'react';

export const EnhancedDrMarcieAvatar: React.FC<any> = (props) => {
  const { size = 64, className = '' } = props;
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size, borderRadius: '9999px', overflow: 'hidden', background: '#eee' }}>
      <img src="/dr-marcie-avatar.png" alt="Dr. Marcie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
};

export default EnhancedDrMarcieAvatar;
