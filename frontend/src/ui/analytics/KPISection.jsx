import React from 'react';

const KPISection = ({ children, columns = 4, className = '' }) => {
  const colMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colMap[columns] || 'grid-cols-1'} gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default KPISection;
