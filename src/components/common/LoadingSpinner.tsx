import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px 20px' }}>
    <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
    <div style={{
      width: '44px', height: '44px',
      border: '3px solid #FF6740',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: '_spin 0.75s linear infinite',
    }} />
  </div>
);

export default LoadingSpinner;
