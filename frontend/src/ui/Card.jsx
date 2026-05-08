import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden ${className}`}>
      <div className={noPadding ? '' : 'p-6 lg:p-8'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
