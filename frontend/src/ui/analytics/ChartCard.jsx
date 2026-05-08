import React from 'react';
import Card from '../Card';

const ChartCard = ({ title, description, children, actions, className = '' }) => {
  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
          {description && <p className="text-[13px] font-bold text-slate-400 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      
      <div className="flex-1 min-h-[300px] w-full">
        {children}
      </div>
    </Card>
  );
};

export default ChartCard;
