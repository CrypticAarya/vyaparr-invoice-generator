import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`premium-card ${noPadding ? 'p-0 overflow-hidden' : 'p-8'} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
